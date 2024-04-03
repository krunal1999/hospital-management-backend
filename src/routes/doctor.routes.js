import { Router } from "express";

import {
  adminAuth,
  doctorAuth,
  verifyJWT,
} from "../middlewares/verifyJWT.middleware.js";
import {
  updateDoctor,
  getDoctorById,
  getAllDoctors,
  getSingleDoctor,
  getAppointment,
  savePrescription,
  updateDoctorApprove,
  updateDoctorAvailable,
  getAllPrescription,
  updatePrescriptioById,
} from "../controllers/doctor.controller.js";
import reviewRouter from "./review.routes.js";

const doctorRouter = Router();

doctorRouter.route("/").get(getAllDoctors);

doctorRouter.route("/:id").get(getSingleDoctor);

doctorRouter.route("/profile/:id").put(verifyJWT, doctorAuth, updateDoctor);
doctorRouter.route("/profile/me/:id").get(verifyJWT, doctorAuth, getDoctorById);

doctorRouter
  .route("/profile/appointment/:id")
  .get(verifyJWT, doctorAuth, getAppointment);

doctorRouter
  .route("/profile/prescription")
  .post(verifyJWT, doctorAuth, savePrescription);

doctorRouter
  .route("/updateapprove/:id")
  .put(verifyJWT, adminAuth, updateDoctorApprove);

doctorRouter
  .route("/updateavailable/:id")
  .put(verifyJWT, adminAuth, updateDoctorAvailable);

doctorRouter
  .route("/profile/getallprescription")
  .get(verifyJWT, adminAuth, getAllPrescription);

doctorRouter
  .route("/profile/updateprescriptionbyid/:id")
  .put(verifyJWT, adminAuth, updatePrescriptioById);

doctorRouter.use("/:doctorId/reviews", reviewRouter);

export { doctorRouter };
