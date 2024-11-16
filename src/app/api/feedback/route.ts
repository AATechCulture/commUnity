import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  eventId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = feedbackSchema.parse(body);

    // Check if event exists and is past
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (new Date(event.date) > new Date()) {
      return NextResponse.json(
        { error: "Cannot provide feedback for future events" },
        { status: 400 }
      );
    }

    // Check if user was registered for the event
    const registration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        status: "confirmed",
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "You must be registered for this event to provide feedback" },
        { status: 403 }
      );
    }

    // Check if user has already provided feedback
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        userId: session.user.id,
        eventId: validatedData.eventId,
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: "You have already provided feedback for this event" },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
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
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
} 