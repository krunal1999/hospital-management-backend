import { Router } from "express";

import { doctorAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  updateDoctor,
  getDoctorById,
  getAllDoctors,
  getSingleDoctor,
  getAppointment,
  savePrescription,
} from "../controllers/doctor.controller.js";
import reviewRouter from "./review.routes.js";

const doctorRouter = Router();

doctorRouter.route("/").get(getAllDoctors);
doctorRouter.route("/:id").get(getSingleDoctor);

doctorRouter.use("/:doctorId/reviews", reviewRouter);

doctorRouter.route("/profile/:id").put(verifyJWT, doctorAuth, updateDoctor);
doctorRouter.route("/profile/me/:id").get(verifyJWT, doctorAuth, getDoctorById);

doctorRouter
  .route("/profile/appointment/:id")
  .get(verifyJWT, doctorAuth, getAppointment);

doctorRouter
  .route("/profile/prescription")
  .post(verifyJWT, doctorAuth, savePrescription);

export { doctorRouter };
