import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to register for events" },
        { status: 401 }
      );
    }

    if (session.user.role !== 'PARTICIPANT') {
      return NextResponse.json(
        { error: "Only participants can register for events" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { eventId } = body;

    // Check if event exists and isn't full
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is full
    if (event._count.registrations >= event.capacity) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: session.user.id,
        eventId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }

    // Create registration with confirmed status instead of pending
    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        eventId,
        status: "confirmed",
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 