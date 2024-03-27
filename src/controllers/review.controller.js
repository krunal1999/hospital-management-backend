import { Doctor } from "../models/doctor.model.js";
import { Review } from "../models/review.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";

// getAll Review
export const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find({});

    res.status(200).json(new ApiResponse(200, reviews, "success"));
  } catch (err) {
    res.status(404).json(new ApiError(404, {}, "Review Not Found"));
  }
};

export const createReview = async (req, res) => {
  // const userId = req.user._id;

  if (!req.body.doctor) req.body.doctor = req.params.doctorId;

  const patient = await Patient.find({ userId: req.user._id });

  // if (!req.body.patient) req.body.patient = req.user._id;
  if (!req.body.patient) req.body.patient = patient[0]._id;
  req.body.patientName = req.user.fullName;
  req.body.patientPhoto = patient[0].photo;

  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();

    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    res.status(200).json(new ApiResponse(200, savedReview, "Review submitted"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Review Not Created"));
  }
};
