import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({});

export const Prescription = mongoose.model("Prescription ", prescriptionSchema);
