import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  medicines: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  doctorFee: { type: Number, required: true },
  remarks: { type: String },
  visitStatus: {
    type: String,
    enum: ["Available", "Booked", "Cancelled", "Completed", "No Show"],
    default: "pending",
  },
  totalCost: { type: Number, required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  visitedDate: {
    type: Date,
  },
});

export const Prescription = mongoose.model("Prescription ", prescriptionSchema);
