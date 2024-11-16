interface EventFormData {
  // ... existing fields ...
  duration: number;
}

function EventForm() {
  // ... existing code ...
  
  return (
    <form>
      {/* ... existing form fields ... */}
      
      <div className="mb-4">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          required
        />
      </div>
      
      {/* ... rest of the form ... */}
    </form>
  );
} 