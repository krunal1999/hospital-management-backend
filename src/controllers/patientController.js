import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import { Booking } from "../models/booking.model.js";
import { Prescription } from "../models/prescription .model.js";

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

export const updateBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const updateBooking = await Prescription.findByIdAndUpdate(
      id,
      {
        paidStatus: "Paid"
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updateBooking, "Data Updated"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Failed To Upadate"));
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

export const getMyAppointment = async (req, res) => {
  const id = req.params.id;

  try {
    const myAppointments = await Booking.find({
      patientId: id,
      bookingStatus: "Booked",
    }).populate({
      path: "doctorId",
      model: "Doctor",
      select: "fullName avgRating totalRating specialization photo experiences",
    });

    res
      .status(200)
      .json(new ApiResponse(200, myAppointments, "Appointment Details"));
  } catch (err) {
    res
      .status(500)
      .json(new ApiError(500, {}, "Appointment Details not found"));
  }
};

export const getCompletedAppointment = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const myAppointments = await Prescription.find({
      patientId: id,
    }).populate({
      path: "bookingId",
    });

    // console.log(myAppointments)

    res
      .status(200)
      .json(new ApiResponse(200, myAppointments, "Appointment Details"));
  } catch (err) {
    res
      .status(500)
      .json(new ApiError(500, {}, "Appointment Details not found"));
  }
};
