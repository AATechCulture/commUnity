import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const reviewSchema = z.object({
  eventId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Prevent organizations from reviewing events
    if (session.user.role === 'ORGANIZATION') {
      return NextResponse.json(
        { error: 'Organizations cannot review events' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = reviewSchema.parse(body)

    // First check if event has passed
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Calculate event end time using duration
    const eventEndTime = new Date(event.date.getTime() + (event.duration * 60000))
    if (eventEndTime > new Date()) {
      return NextResponse.json(
        { error: 'You can only review past events' },
        { status: 403 }
      )
    }

    // Then check if user attended the event
    const registration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        status: 'confirmed',
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'You must attend the event to leave a review' },
        { status: 403 }
      )
    }

    // Create or update review
    const review = await prisma.eventReview.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: validatedData.eventId,
        },
      },
      update: {
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      create: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.eventReview.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Review fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 