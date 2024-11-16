import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { addHours, addDays, isWithinInterval } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's registered events
    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.user.id,
        status: "confirmed",
      },
      include: {
        event: true,
      },
    });

    const now = new Date();
    const notifications = [];

    for (const registration of registrations) {
      const eventDate = new Date(registration.event.date);
      const oneDayBefore = addDays(now, 1);
      const oneHourBefore = addHours(now, 1);

      // Check if event is within the next day
      if (isWithinInterval(eventDate, { start: now, end: oneDayBefore })) {
        notifications.push({
          id: `${registration.id}-day`,
          eventId: registration.event.id,
          eventTitle: registration.event.title,
          eventDate: registration.event.date,
          type: 'day_before',
        });
      }

      // Check if event is within the next hour
      if (isWithinInterval(eventDate, { start: now, end: oneHourBefore })) {
        notifications.push({
          id: `${registration.id}-hour`,
          eventId: registration.event.id,
          eventTitle: registration.event.title,
          eventDate: registration.event.date,
          type: 'hour_before',
        });
      }
    }

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
} 