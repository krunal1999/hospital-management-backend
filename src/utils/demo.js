// const fs = require("fs");
// const { google } = require("googleapis");

import fs from "fs"
import { google } from "googleapis";

// Load the Google Calendar API credentials from a JSON file
const credentials = JSON.parse(
  fs.readFileSync(
    "D:\\Hospital Management\\backend\\hospitalproject-419200-a01849a79071.json"
  )
);
// Set up the Google Calendar API client
const calendar = google.calendar({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  }),
});

// Function to create a new event
async function createEvent(event) {
  try {
    // Insert event into Google Calendar
    const response =  calendar.events.insert({
      calendarId: "primary", // Specify calendar ID
      resource: event,
    });

    // Log the event link
    console.log("Event created: %s", response.data.htmlLink);
  } catch (err) {
    console.error("Error creating event:", err);
  }
}

// Example event details
const eventDetails = {
  summary: "Sample Event",
  location: "Google Office",
  description: "This is a sample event created programmatically.",
  start: {
    dateTime: "2024-04-05T09:00:00", // Specify start time
    timeZone: "America/Los_Angeles", // Specify time zone
  },
  end: {
    dateTime: "2024-04-05T17:00:00", // Specify end time
    timeZone: "America/Los_Angeles", // Specify time zone
  },
};

// Call the createEvent function with the event details
createEvent(eventDetails);
