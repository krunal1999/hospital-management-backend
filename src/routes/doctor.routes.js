import { Router } from "express";

import { doctorAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  updateDoctor,
  getDoctorById,
  getAllDoctors
} from "../controllers/doctor.controller.js";

const doctorRouter = Router();

doctorRouter.route("/").get(getAllDoctors);
doctorRouter.route("/:id").get(getDoctorById);


doctorRouter.route("/profile/:id").put(verifyJWT, doctorAuth, updateDoctor);
doctorRouter.route("/profile/me/:id").get(verifyJWT, doctorAuth, getDoctorById);

// userRouter.route("/logout").post(verifyJWT , logout);

export { doctorRouter };
