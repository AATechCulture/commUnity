import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Get all events with their details
    const events = await prisma.event.findMany({
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    })

    // Convert events to a format suitable for AI analysis
    const eventsContext = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      category: event.category,
      organization: event.organization.name,
      price: event.price || 0,
      registrations: event._count.registrations,
      capacity: event.capacity,
    }))

    // Create Groq completion to analyze the search query
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful event search assistant. Given a list of events and a natural language query, return the IDs of the most relevant events. Events: ${JSON.stringify(eventsContext)}`
        },
        {
          role: "user",
          content: `Find events matching this query: "${query}". Return only a JSON array of event IDs, ordered by relevance. Format: {"eventIds": ["id1", "id2", ...]}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
    })

    const response = JSON.parse(completion.choices[0].message.content)
    const relevantEventIds = response.eventIds || []

    // Fetch the full details of matched events
    const matchedEvents = await prisma.event.findMany({
      where: {
        id: {
          in: relevantEventIds,
        },
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    })

    // Sort events in the same order as the AI response
    const sortedEvents = relevantEventIds.map(id => 
      matchedEvents.find(event => event.id === id)
    ).filter(Boolean)

    return NextResponse.json(sortedEvents)
  } catch (error) {
    console.error('AI search error:', error)
    return NextResponse.json(
      { error: 'Failed to search events' },
      { status: 500 }
    )
  }
} 