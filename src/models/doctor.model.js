import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    appointmentPrice: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    timeslot: {
      type: String,
      default: "",
    },
    avgRating: {
      type: String,
      default: "",
    },
    totalRating: {
      type: String,
      default: "",
    },
    isApproved: {
      type: String,
      default: "",
    },
    isAllowed: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
