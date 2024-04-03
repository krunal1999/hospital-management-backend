import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import { Booking } from "../models/booking.model.js";

export const generateSlots = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const dateRange = getDateRange(startDate, endDate);
    const daysRange = dateRange.map((date) => date.split(" "));

    const doctors = await Doctor.find({}, "_id timeSlots");
    //     console.log(dateRange);

    let isSlotsCreated = 0;
    for (const date of dateRange) {
      const existingSlots = await Booking.find({ date }).limit(4);
      if (existingSlots.length > 0) {
        isSlotsCreated++;
        continue;
      }
    }

    for (let doctor of doctors) {
      if (isSlotsCreated >= 1) {
        console.log("Slots are Created for week");
        return res
          .status(201)
          .json(new ApiError(201, {}, "Slots are Created for week"));
      }
      const { timeSlots } = doctor;

      console.log("Doctor ", doctor._id);

      // sorted acording to days monday to sunday
      timeSlots.sort((a, b) => {
        const dayValueA = getDayValue(a.day);
        const dayValueB = getDayValue(b.day);
        return dayValueA - dayValueB;
      });
      //       console.log(timeSlots.length);

      let i = 0;

      for (let dayRange of daysRange) {
        let dayNow = dayRange[0].toLowerCase().trim().replace(/,\s*$/, "");
        let dateNow = dayRange.join(" ");

        if (dayNow === timeSlots[i].day) {
          //   console.log(timeSlots[i].day);
          const allocatedTimeSlots = allocateTimeSlots([timeSlots[i]], 60);
          // console.log(allocatedTimeSlots);

          for (const slot of allocatedTimeSlots) {
            const { day, startingTime, endingTime } = slot;
            const londonTimezone = "Europe/London";

            const fsdate = new Date(dateNow);
            const [hoursStart, minutesStart] = startingTime.split(":");
            fsdate.setHours(hoursStart);
            fsdate.setMinutes(minutesStart);

            const fedate = new Date(dateNow);
            const [hoursEnd, minutesEnd] = endingTime.split(":");
            fedate.setHours(hoursEnd);
            fedate.setMinutes(minutesEnd);

            const startFDate = new Date(
              fsdate.toLocaleString("en-US", { timeZone: londonTimezone })
            );

            const endFDate = new Date(
              fedate.toLocaleString("en-US", { timeZone: londonTimezone })
            );

            const emptySlot = new Booking({
              date: dateNow,
              currentDay: dayNow,
              slotDay: day,
              startTime: startingTime,
              endTime: endingTime,
              isAvaliable: true,
              bookingStatus: "Available",
              doctorId: doctor._id,
              patientId: null,
              futureStartDate: startFDate,
              futureEndDate: endFDate,
            });
            await emptySlot.save();
          }

          if (i >= timeSlots.length - 1) {
            break;
          } else {
            i = i + 1;
          }
        } else {
          //   console.log("doctor not available");
        }
      }
    }

    console.log("loop end");

    return res.status(200).json(new ApiResponse(200, {}, "generated slot"));
  } catch (err) {
    console.log(err);
    return res
      .status(501)
      .json(new ApiError(501, {}, "Failed To Create Slots"));
  }
};

export const availableSlots = async (req, res) => {
  try {
    const id = req.params.id;
    const currentTime = new Date();

    const doctorBookings = await Booking.find({
      doctorId: id,
      futureStartDate: { $gt: currentTime },
      isAvaliable: true,
    });

    if (doctorBookings.length > 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, doctorBookings, "Available Slots"));
    } else {
      return res.status(200).json(new ApiResponse(200, {}, "No slot"));
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json(new ApiError(501, {}, "Failed To Find Slots"));
  }
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

export const updateBookingStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, updatedBooking, "Booking Confirmed"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Booking Failed"));
  }
};

export const deleteByDateRange = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    console.log(startDate, endDate);

    let futureStartDate = new Date(startDate);
    let futureEndDate = new Date(endDate);

    futureStartDate.setHours(0, 0, 0, 0);
    futureEndDate.setHours(23, 59, 59, 999);

    const deleteResult = await Booking.deleteMany({
      futureStartDate: {
        $gte: futureStartDate,
        $lt: futureEndDate,
      },
    });

    console.log(`Deleted ${deleteResult.deletedCount} documents`);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `Deleted ${deleteResult.deletedCount} documents`
        )
      );
  } catch (err) {
    console.error("Error deleting documents:", err);
    res.status(500).json(new ApiError(500, {}, "Booking Failed"));
  }
};
