import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { StarIcon } from "@heroicons/react/24/outline";

export default async function ManageEventPage({ params }: { params: { id: string } }) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ORGANIZATION') {
    redirect('/login');
  }

  const event = await prisma.event.findUnique({
    where: { 
      id: params.id,
    },
    include: {
      registrations: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: {
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
      },
      _count: {
        select: {
          registrations: true,
          reviews: true,
        },
      },
    },
  });

  if (!event || event.organizationId !== session.user.organizationId) {
    notFound();
  }

  const averageRating = event.reviews.length > 0
    ? event.reviews.reduce((acc, review) => acc + review.rating, 0) / event.reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Registrations</h3>
            <p className="mt-1 text-2xl font-semibold">
              {event._count.registrations} / {event.capacity}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
            <p className="mt-1 text-2xl font-semibold">{event._count.reviews}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <div className="mt-1 flex items-center">
              <span className="text-2xl font-semibold mr-2">
                {averageRating.toFixed(1)}
              </span>
              <StarIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Event Reviews</h2>
          <div className="space-y-6">
            {event.reviews.length > 0 ? (
              event.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <time className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet for this event.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 