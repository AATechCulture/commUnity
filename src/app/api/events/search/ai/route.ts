import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return new NextResponse("Query parameter is required", { status: 400 })
    }

    // Fetch user's interests and details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        interests: true,
        name: true,
        registrations: {
          include: {
            event: true
          }
        }
      }
    })

    // Fetch all events
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      include: {
        organization: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    const eventsContext = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      category: event.category,
      organization: event.organization.name,
      registrations: event._count.registrations,
    }))

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI search assistant. Analyze the events based on the user's query and return ALL events sorted by relevance.
          
Instructions:
1. Return ALL events, even if they don't perfectly match the query
2. Score each event based on:
   - Relevance to search terms
   - Date/time match if specified
   - Location match if specified
   - Category match if specified
   - User interests: ${user?.interests?.join(", ") || "not specified"}

3. Return a JSON object with an "events" array containing:
   {
     "events": [
       {
         "id": "event_id",
         "score": 0.95,
         "reason": "Brief explanation of relevance"
       }
     ]
   }`
        },
        {
          role: "user",
          content: `Query: "${query}"\nEvents: ${JSON.stringify(eventsContext)}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    })

    try {
      const aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{"events": []}')
      
      // Combine AI recommendations with event data and include ALL events
      const scoredEvents = events.map(event => {
        const aiMatch = aiResponse.events.find((e: any) => e.id === event.id)
        return {
          ...event,
          score: aiMatch?.score || 0,
          reason: aiMatch?.reason || "No specific match for your search"
        }
      })

      // Sort by score but include all events
      const sortedEvents = scoredEvents.sort((a, b) => b.score - a.score)

      return NextResponse.json(sortedEvents)
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      // Return all events if AI scoring fails
      return NextResponse.json(events.map(event => ({
        ...event,
        score: 0,
        reason: "Search ranking unavailable"
      })))
    }
  } catch (error) {
    console.error("AI search error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 