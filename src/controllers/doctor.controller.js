import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import { Review } from "../models/review.model.js";
import { Booking } from "../models/booking.model.js";
import { Prescription } from "../models/prescription .model.js";

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

export const getAppointment = async (req, res) => {
  const id = req.params.id;

  try {
    const myAppointments = await Booking.find({
      doctorId: id,
      bookingStatus: "Booked",
    }).populate({
      path: "patientId",
      model: "Patient",
      populate: {
        path: "userId",
        select: "fullName email ",
      },
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

export const savePrescription = async (req, res) => {
  // const id = req.params.id;

  const newPrescription = new Prescription(req.body);

  try {
    const savePrescription = await newPrescription.save();

    const updateBookingStatus = await Booking.findByIdAndUpdate(
      req.body.bookingId,
      { bookingStatus: req.body.visitStatus },
      { new: true }
    );
    if (updateBookingStatus === null || savePrescription === null) {
      res.status(500).json(new ApiError(500, {}, "Error saving prescription"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Prescription saved successfully"));
  } catch (error) {
    console.error("Error saving prescription:", error);
    res.status(500).json(new ApiError(500, {}, "Error saving prescription"));
  }
};

export const updateDoctorApprove = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        isApproved: "approved",
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

export const updateDoctorAvailable = async (req, res) => {
  const id = req.params.id;

  try {
    
    const originalDoctor = await Doctor.findById(id);

    
    const updatedIsAllowed = !originalDoctor.isAllowed;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        isAllowed: updatedIsAllowed,
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedDoctor, "Profile Data Updated"));
  } catch (err) {
    res.status(500).json(new ApiError(500, {}, "Failed To Update Profile"));
  }
};
