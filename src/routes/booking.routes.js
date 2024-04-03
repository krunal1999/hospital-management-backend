import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  generateSlots,
  availableSlots,
  updateBookingStatus,
  deleteByDateRange,
  generateSlotsById,
  deleteByDateRangeById,
  bookedSlotsAll,
} from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.route("/pre-generate-slots").post(generateSlots);
bookingRouter.route("/pre-generate-slots/:id").post(generateSlotsById);

bookingRouter.route("/delete-slots").delete(deleteByDateRange);
bookingRouter.route("/delete-slots/id").delete(deleteByDateRangeById);

// bookingRouter
//   .route("/getslots/:id")
//   .get(verifyJWT, patientAuth, availableSlots);

bookingRouter.route("/getslots/:id").get(availableSlots);
bookingRouter.route("/getslots/allbooked/:id").get(bookedSlotsAll);

bookingRouter.route("/bookappointment/:id").put(updateBookingStatus);

export { bookingRouter };
