import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";

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
  console.log(req.body);

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
