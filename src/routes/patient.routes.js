import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getPatientById,
  updatePatient,
} from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.route("/profile/:id").put(verifyJWT, patientAuth, updatePatient);

patientRouter
  .route("/profile/me/:id")
  .get(verifyJWT, patientAuth, getPatientById);

// userRouter.route("/logout").post(verifyJWT , logout);

export { patientRouter };
