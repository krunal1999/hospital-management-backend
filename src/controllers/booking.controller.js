import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import { Booking } from "../models/booking.model.js";

export const generateSlots = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.body;
    const dateRange = getDateRange(startDate, endDate);
    //     console.log(dateRange);
    const daysRange = dateRange.map((date) => date.split(" "));
    //     console.log(daysRange);

    const doctor = await Doctor.findById(doctorId);

    const { timeSlots } = doctor;

    // sorted acording to days monday to sunday
    timeSlots.sort((a, b) => {
      const dayValueA = getDayValue(a.day);
      const dayValueB = getDayValue(b.day);
      return dayValueA - dayValueB;
    });
    //     console.log(timeSlots);

    let i = 0;
    let j = 0;
    for (let dayRange of daysRange) {
      let dayNow = dayRange[0].toLowerCase().trim().replace(/,\s*$/, "");
      console.log(dayNow);

      if (dayNow === timeSlots[i].day) {
        console.log(timeSlots[i].day);
        const allocatedTimeSlots = allocateTimeSlots([timeSlots[i]], 60);
        // console.log(allocatedTimeSlots);

        for (const slot of allocatedTimeSlots) {
          const { day, startingTime, endingTime } = slot;

          const emptySlot = new Booking({
            date: dayRange.toString(),
            currentDay: day,
            slotDay: day,
            startTime: startingTime,
            endTime: endingTime,
            isAvaliable: true,
            bookingStatus: "Available",
            doctorId: doctor._id,
            patientId: null,
          });
          await emptySlot.save();
        }
        i = i + 1;
      }

      j = j + 1;
      //       console.log(j);
      if (j > 6) {
        break;
      }
    }
    console.log("loop end");

    return res.status(200).json(new ApiResponse(200, daysRange, "asd"));
  } catch (err) {}
};

export const availableSlots = async (req, res) => {
  try {
  } catch (err) {}
};

function getDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateRange = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);
    dateRange.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
}

function allocateTimeSlots(timeSlots, breakTime) {
  const allocatedSlots = [];

  timeSlots.forEach((slot) => {
    const { day, startingTime, endingTime, breakstartingTime } = slot;
    const allocatedDaySlots = [];

    // Convert startingTime, endingTime, and breakstartingTime to minutes
    const startTime = convertToMinutes(startingTime);
    const endTime = convertToMinutes(endingTime);
    const breakStartTime = convertToMinutes(breakstartingTime);

    console.log("endTime", endTime);
    console.log("breakStartTime", breakStartTime);

    let breakDuration = 0;
    let totalAvailableTime = 0;
    if (breakStartTime > endTime) {
      totalAvailableTime = endTime - startTime;
    } else {
      breakDuration = 60;
      totalAvailableTime = endTime - startTime - breakDuration;
    }

    const numberOfIntervals = Math.floor(totalAvailableTime / 30);

    // Allocate time slots for each patient
    let currentTime = startTime;
    for (let i = 0; i < numberOfIntervals; i++) {
      // Skip over break time
      if (
        currentTime >= breakStartTime &&
        currentTime < breakStartTime + breakDuration
      ) {
        currentTime = breakStartTime + breakDuration;
      }

      let etime = currentTime + 30;
      // Allocate 30-minute slot
      allocatedDaySlots.push({
        day,
        // time: convertToTime(currentTime),
        startingTime: convertToTime(currentTime),
        endingTime: convertToTime(etime),
      });

      // Move to the next 30-minute slot
      currentTime += 30;
    }

    // Add allocated slots for the day to the result array
    allocatedSlots.push(...allocatedDaySlots);
  });

  return allocatedSlots;
}

function convertToMinutes(time) {
  //   console.log("convertToMinutes - " , time);
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function convertToTime(minutes) {
  //   console.log("convertToMinutes - " , minutes);

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function getDayValue(day) {
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return daysOfWeek.indexOf(day.toLowerCase());
}
