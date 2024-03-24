import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    ticketPrice: {
      type: String,
      default: "",
    },
    qualifications: {
      type: Array,
    },
    experiences: {
      type: Array,
    },
    bio: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    timeSlots: {
      type: Array,
    },
    avgRating: {
      type: String,
      default: "0",
    },
    totalRating: {
      type: String,
      default: "0",
    },
    isApproved: {
      type: String,
      default: "pending",
    },
    isAllowed: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
