import { Router } from "express";

import { patientAuth, verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { generateSlots } from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.route("/pre-generate-slots").post(generateSlots);

export { bookingRouter };
