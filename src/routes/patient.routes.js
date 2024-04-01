import { Router } from "express";

import {
  adminAuth,
  patientAuth,
  verifyJWT,
} from "../middlewares/verifyJWT.middleware.js";
import {
  getPatientById,
  updatePatient,
  getMyAppointment,
  getCompletedAppointment,
  updateBooking,
  getAllPatient,
  getPatientByIdbyAdmin,
  updatePatientStatus,
} from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.route("/profile/:id").put(verifyJWT, patientAuth, updatePatient);

patientRouter
  .route("/profile/block/:id")
  .put(verifyJWT, adminAuth, updatePatientStatus);

patientRouter
  .route("/profile/booking/:id")
  .put(verifyJWT, patientAuth, updateBooking);

patientRouter
  .route("/profile/me/:id")
  .get(verifyJWT, patientAuth, getPatientById);

patientRouter.route("/getprofile/:id").get(getPatientByIdbyAdmin);

patientRouter
  .route("/profile/appointment/:id")
  .get(verifyJWT, patientAuth, getMyAppointment);

patientRouter
  .route("/profile/completeappointment/:id")
  .get(verifyJWT, patientAuth, getCompletedAppointment);

patientRouter.route("/all").get(verifyJWT, adminAuth, getAllPatient);

export { patientRouter };
