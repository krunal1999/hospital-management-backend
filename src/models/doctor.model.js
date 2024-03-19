import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    appointmentPrice: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    timeslot: {
      type: String,
      required: true,
    },
    avgRating: {
      type: String,
      required: true,
    },
    totalRating: {
      type: String,
      required: true,
    },
    isApproved: {
      type: String,
      required: true,
    },
    isAllowed: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
