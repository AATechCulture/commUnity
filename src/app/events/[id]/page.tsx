import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/outline";
import { RegisterEventButton } from "@/components/RegisterEventButton";
import { FeedbackForm } from '@/components/FeedbackForm';
import { EventReviewForm } from '@/components/EventReviewForm'
import Link from 'next/link';

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

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`

  const isRegistered = event.registrations.length > 0;
  const isOrganizer = session?.user?.organizationId === event.organizationId;
  const spotsLeft = event.capacity - event._count.registrations;

  // Calculate if event is past based on end time
  const eventEndTime = new Date(event.date.getTime() + (event.duration * 60000));
  const isPastEvent = eventEndTime < new Date();
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

  const feedbackAverageRating = feedbacks.length > 0
    ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length
    : 0;

  // Fetch reviews
  const reviews = await prisma.eventReview.findMany({
    where: { eventId: params.id },
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

  const reviewAverageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
          <div className="mt-4">
          <iframe
            src={mapSrc}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map for ${event.location}`}
          ></iframe>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Event Reviews</h2>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 flex items-center">
                    <StarIcon className="h-5 w-5" />
                    {reviewAverageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {session?.user ? (
                canProvideFeedback ? (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
                    <EventReviewForm eventId={params.id} />
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      {!isRegistered 
                        ? "You must be registered for this event to leave a review"
                        : userRegistration?.status !== 'confirmed'
                        ? "Your registration must be confirmed to leave a review"
                        : "You can leave a review after the event has ended"}
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Want to share your experience?
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors duration-300"
                  >
                    Log in to review
                  </Link>
                </div>
              )}

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{review.user.name}</p>
                        <div className="flex text-yellow-400 mt-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <StarIcon key={i} className="h-4 w-4" />
                          ))}
                        </div>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-gray-600 dark:text-gray-300">
                        {review.comment}
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