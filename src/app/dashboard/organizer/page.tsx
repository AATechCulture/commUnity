export default async function OrganizerDashboard() {
  // ... existing code to fetch events ...

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Event Dashboard</h1>
      <OrganizedEventsList events={events} />
    </div>
  );
} 