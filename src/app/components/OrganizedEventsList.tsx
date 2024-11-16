import { Event } from '@prisma/client';
import { format } from 'date-fns';

interface OrganizedEventsListProps {
  events: Event[];
}

export default function OrganizedEventsList({ events }: OrganizedEventsListProps) {
  const now = new Date();

  const ongoingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const eventEnd = new Date(eventDate.getTime() + event.duration * 60000);
    return eventDate <= now && eventEnd >= now;
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate > now;
  });

  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const eventEnd = new Date(eventDate.getTime() + event.duration * 60000);
    return eventEnd < now;
  });

  const renderEventList = (eventList: Event[], sectionTitle: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{sectionTitle}</h2>
      {eventList.length === 0 ? (
        <p className="text-gray-500">No events in this category</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map(event => (
            <div key={event.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-600">
                {format(new Date(event.date), 'PPP p')}
              </p>
              <p className="text-gray-600">
                Duration: {event.duration} minutes
              </p>
              {/* Add your existing event actions/buttons here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {renderEventList(ongoingEvents, "Ongoing Events")}
      {renderEventList(upcomingEvents, "Upcoming Events")}
      {renderEventList(pastEvents, "Past Events")}
    </div>
  );
} 