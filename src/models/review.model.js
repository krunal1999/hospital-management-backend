import mongoose from "mongoose";
import { Doctor } from "./doctor.model.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
    },
    patientName: {
      type: String,
      default: "",
    },
    patientPhoto: {
      type: String,
      default: "",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// prevent duplicate review
// reviewSchema.index({ doctor: 1, user: 1 }, { unique: true });

reviewSchema.virtual("patientData", {
  ref: "Patient",
  localField: "patient",
  foreignField: "_id",
  justOne: true,
});

reviewSchema.pre(/^find/, function (next) {
  this.populate("patientData");
  next();
});


reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      totalRating: stats[0].numOfRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    // If no reviews found, set totalRating and averageRating to 0
    await Doctor.findByIdAndUpdate(doctorId, {
      totalRating: 0,
      averageRating: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

export const Review = mongoose.model("Review", reviewSchema);
