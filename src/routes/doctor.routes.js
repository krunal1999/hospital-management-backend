import { Router } from "express";

import { doctorAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  updateDoctor,
  getDoctorById,
  getAllDoctors,
  getSingleDoctor,
} from "../controllers/doctor.controller.js";
import reviewRouter from "./review.routes.js";

const doctorRouter = Router();

doctorRouter.route("/").get(getAllDoctors);
doctorRouter.route("/:id").get(getSingleDoctor);

doctorRouter.use("/:doctorId/reviews", reviewRouter);

doctorRouter.route("/profile/:id").put(verifyJWT, doctorAuth, updateDoctor);
doctorRouter.route("/profile/me/:id").get(verifyJWT, doctorAuth, getDoctorById);

// userRouter.route("/logout").post(verifyJWT , logout);

export { doctorRouter };
