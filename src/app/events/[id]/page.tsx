import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/outline";
import { RegisterEventButton } from "@/components/RegisterEventButton";
import { FeedbackForm } from '@/components/FeedbackForm';

interface Feedback {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  const event = await prisma.event.findUnique({
    where: { 
      id: params.id 
    },
    include: {
      organization: true,
      registrations: {
        where: session?.user ? {
          userId: session.user.id
        } : undefined,
      },
      _count: {
        select: {
          registrations: true
        }
      }
    }
  });

  if (!event) {
    notFound();
  }

  const isRegistered = event.registrations.length > 0;
  const isOrganizer = session?.user?.organizationId === event.organizationId;
  const spotsLeft = event.capacity - event._count.registrations;

  const isPastEvent = new Date(event.date) < new Date();
  const userRegistration = event.registrations[0];
  const canProvideFeedback = isPastEvent && userRegistration?.status === 'confirmed';

  // Fetch feedbacks if it's a past event
  let feedbacks: Feedback[] = [];
  if (isPastEvent) {
    try {
      feedbacks = await prisma.feedback.findMany({
        where: { eventId: event.id },
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
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  }

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        {event.image && (
          <div className="aspect-video w-full relative">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{event.title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Organized by {event.organization.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <CalendarIcon className="h-6 w-6 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPinIcon className="h-6 w-6 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <UserGroupIcon className="h-6 w-6 mr-2" />
                <span>{spotsLeft} spots left</span>
              </div>
              {event.price && event.price > 0 && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                  <span>${event.price.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {session?.user && !isOrganizer && (
                <RegisterEventButton
                  eventId={event.id}
                  isRegistered={isRegistered}
                  isFull={spotsLeft <= 0}
                  className="w-full"
                />
              )}
              {event.category && (
                <div className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                  {event.category}
                </div>
              )}
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-2">About this event</h2>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>

          {!session?.user && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <p className="text-purple-600 dark:text-purple-300 mb-2">
                Want to register for this event?
              </p>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors duration-300"
              >
                Log in to register
              </a>
            </div>
          )}

          {isPastEvent && (
            <div className="mt-8 space-y-6">
              <h2 className="text-2xl font-semibold">Event Feedback</h2>
              
              {canProvideFeedback && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
                  <FeedbackForm eventId={event.id} />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Average Rating:</span>
                  <span className="text-yellow-400">
                    {averageRating.toFixed(1)} ★
                  </span>
                  <span className="text-gray-500">
                    ({feedbacks.length} reviews)
                  </span>
                </div>

                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{feedback.user.name}</p>
                        <div className="flex text-yellow-400 mt-1">
                          {Array.from({ length: feedback.rating }).map((_, i) => (
                            <StarIcon key={i} className="h-5 w-5" />
                          ))}
                        </div>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    {feedback.comment && (
                      <p className="mt-3 text-gray-600 dark:text-gray-300">
                        {feedback.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 