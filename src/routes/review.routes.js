import express from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";

import {
  createReview,
  getAllReview,
} from "../controllers/review.controller.js";

const reviewRouter = express.Router({ mergeParams: true });

// get all users
reviewRouter.route("/").get(getAllReview).post(verifyJWT, patientAuth, createReview);

export default reviewRouter;
