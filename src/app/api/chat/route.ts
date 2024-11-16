import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { message, history } = body

    const chatHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for a community events platform. Help users with:
          - Finding and discovering events
          - Understanding how to use the platform
          - Getting information about community activities
          - Answering questions about event registration and management
          
          Be friendly and conversational. The user's name is ${session.user.name}.
          
          If users want to search for specific events, you can guide them to:
          1. Use the search bar at the top of the page
          2. Browse the events page
          3. Check their dashboard for recommended events`
        },
        ...chatHistory,
        { role: "user", content: message }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    })

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."
    })

  } catch (error) {
    console.error("Chat error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 