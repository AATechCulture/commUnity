import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ORGANIZATION') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Verify the event belongs to this organization
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId: session.user.organizationId,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
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