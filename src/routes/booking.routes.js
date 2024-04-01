import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  generateSlots,
  availableSlots,
  updateBookingStatus,
  deleteByDateRange,
} from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.route("/pre-generate-slots").post(generateSlots);
bookingRouter.route("/delete-slots").delete(deleteByDateRange);

// bookingRouter
//   .route("/getslots/:id")
//   .get(verifyJWT, patientAuth, availableSlots);

bookingRouter.route("/getslots/:id").get(availableSlots);

bookingRouter.route("/bookappointment/:id").put(updateBookingStatus);

export { bookingRouter };
