import { Router } from "express";

import { doctorAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  updateDoctor,
  getDoctorById,
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.route("/profile/:id").put(verifyJWT, doctorAuth, updateDoctor);
doctorRouter.route("/profile/me/:id").get(verifyJWT, doctorAuth, getDoctorById);

// userRouter.route("/logout").post(verifyJWT , logout);

export { doctorRouter };
