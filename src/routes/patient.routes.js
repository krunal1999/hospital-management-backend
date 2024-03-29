import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getPatientById,
  updatePatient,
  getMyAppointment,
  getCompletedAppointment,
  updateBooking,
} from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.route("/profile/:id").put(verifyJWT, patientAuth, updatePatient);

patientRouter
  .route("/profile/booking/:id")
  .put(verifyJWT, patientAuth, updateBooking);

patientRouter
  .route("/profile/me/:id")
  .get(verifyJWT, patientAuth, getPatientById);

patientRouter
  .route("/profile/appointment/:id")
  .get(verifyJWT, patientAuth, getMyAppointment);

patientRouter
  .route("/profile/completeappointment/:id")
  .get(verifyJWT, patientAuth, getCompletedAppointment);

export { patientRouter };
