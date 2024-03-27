import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";

export const updatePatient = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedPatient, "Profile Data Updated"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Failed To Upadate Profile"));
  }
};

export const getPatientById = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  try {
    const currentPatient = await Patient.findById(id);

    if (!currentPatient) {
      return res.status(404).json(new ApiError(404, {}, "Patient not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, currentPatient, "current patient data"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Current Patient not found"));
  }
};
