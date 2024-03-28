import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getPatientById,
  updatePatient,
  getMyAppointment,
} from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.route("/profile/:id").put(verifyJWT, patientAuth, updatePatient);

patientRouter
  .route("/profile/me/:id")
  .get(verifyJWT, patientAuth, getPatientById);

patientRouter
  .route("/profile/appointment/:id")
  .get(verifyJWT, patientAuth, getMyAppointment);

// userRouter.route("/logout").post(verifyJWT , logout);

export { patientRouter };
