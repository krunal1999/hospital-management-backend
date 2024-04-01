import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  age: {
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
  role: {
    type: String,
    default: "",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

export const Patient = mongoose.model("Patient", patientSchema);
