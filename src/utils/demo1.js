function createGoogleCalendarLink(eventDetails) {
  const { title, description, start, end, location } = eventDetails;
  const startDateTime = new Date(start).toISOString().replace(/-|:|\.\d+/g, "");
  const endDateTime = new Date(end).toISOString().replace(/-|:|\.\d+/g, "");
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE`;
  const eventUrl = `&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${startDateTime}/${endDateTime}&location=${encodeURIComponent(location)}`;

  return calendarUrl + eventUrl;
}

// Example usage with your desired time, location, and time zone
const eventDetails = {
  title: "My Event",
  description: "This is a sample event",
  start: "2024-04-03T15:00:00+01:00", // Start time in UK time zone (14:00 or 2 PM)
  end: "2024-04-03T15:30:00+01:00", // End time in UK time zone (16:00 or 4 PM)
  location: "London, UK", // Change the location to your desired city
};

const calendarLink = createGoogleCalendarLink(eventDetails);
console.log(calendarLink);
