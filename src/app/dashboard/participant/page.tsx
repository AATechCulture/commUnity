import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participant Dashboard | Events App",
  description: "View your registered events and discover new ones",
};

export default async function ParticipantDashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'PARTICIPANT') {
    redirect('/dashboard');
  }

  // Fetch user data including interests
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      interests: true
    }
  });

  if (!user) {
    redirect('/login');
  }

  const now = new Date();

  // Fetch user's registered events
  const userRegistrations = await prisma.registration.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      event: {
        include: {
          organization: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Categorize registered events
  const categorizedEvents = {
    currentEvents: userRegistrations.filter(reg => {
      const eventDate = new Date(reg.event.date);
      const eventEnd = new Date(eventDate.getTime() + (reg.event.duration * 60000));
      return eventDate <= now && eventEnd >= now;
    }),
    upcomingEvents: userRegistrations.filter(reg => {
      const eventDate = new Date(reg.event.date);
      return eventDate > now;
    }),
    pastEvents: userRegistrations.filter(reg => {
      const eventDate = new Date(reg.event.date);
      const eventEnd = new Date(eventDate.getTime() + (reg.event.duration * 60000));
      return eventEnd < now;
    })
  };

  // Fetch recommended events
  const recommendedEvents = await prisma.event.findMany({
    where: {
      NOT: {
        registrations: {
          some: {
            userId: session.user.id,
          },
        },
      },
      date: {
        gte: new Date(),
      },
      OR: [
        {
          category: {
            in: user.interests,
          },
        },
        {
          category: null,
        },
      ],
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
    take: 3,
  });

  const renderEventSection = (title: string, events: typeof userRegistrations, showStatus = true) => (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((registration) => (
            <div key={registration.id} className="h-full">
              <EventCard
                event={registration.event}
                footer={
                  <div className="mt-4 space-y-2">
                    {showStatus && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Status: {registration.status}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          By: {registration.event.organization.name}
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/events/${registration.event.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No events in this category</p>
      )}
    </section>
  );

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold gradient-text">
          Welcome back, {session.user.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here are your upcoming events and recommendations
        </p>
      </div>

      {/* Current Events */}
      {renderEventSection("Current Events", categorizedEvents.currentEvents)}

      {/* Upcoming Events */}
      {renderEventSection("Upcoming Events", categorizedEvents.upcomingEvents)}

      {/* Past Events */}
      {renderEventSection("Past Events", categorizedEvents.pastEvents)}

      {/* Recommended Events */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommended Events</h2>
          <Link
            href="/events"
            className="text-purple-600 hover:text-purple-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        {recommendedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedEvents.map((event) => (
              <div key={event.id} className="h-full">
                <EventCard
                  event={event}
                  footer={
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {event._count.registrations} registered
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          By: {event.organization.name}
                        </span>
                      </div>
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No upcoming events available.
          </p>
        )}
      </section>
    </div>
  );
} 