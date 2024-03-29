import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  currentDay: {
    type: String,
  },
  slotDay: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  isAvaliable: {
    type: Boolean,
    default: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Available", "Booked", "Cancelled", "Completed" , "No Show"],
    default: "Booked",
  },
  futureDate: {
    type: Date, 
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);
