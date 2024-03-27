import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import { Review } from "../models/review.model.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedDoctor, "Profile Data Updated"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Failed To Upadate Profile"));
  }
};

export const getDoctorById = async (req, res) => {
  const id = req.params.id;

  try {
    const currentDoctor = await Doctor.findById(id);

    if (!currentDoctor) {
      return res.status(404).json(new ApiError(404, {}, "Doctor not found"));
    }

    res.status(200).json(new ApiResponse(200, currentDoctor, "current Doctor"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Current Doctor not found"));
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        // isApproved: "",
        $or: [
          { fullName: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
          { "userId.fullName": { $regex: query, $options: "i" } },
        ],
      })
        .populate("userId", "fullName email")
        .select("-password");
    } else {
      doctors = await Doctor.find().select("-password");
    }

    res.status(200).json(new ApiResponse(200, doctors, "Doctors Got"));
  } catch (err) {
    res.status(404).json(new ApiError(500, {}, "No Doctors"));
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const currentDoctor = await Doctor.findById(id).populate("reviews");

    if (!currentDoctor) {
      return res.status(404).json(new ApiError(404, {}, "Doctor not found"));
    }

    res.status(200).json(new ApiResponse(200, currentDoctor, "current Doctor"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Current Doctor not found"));
  }
};
