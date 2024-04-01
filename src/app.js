import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

const app = express();

const stripe = new Stripe(
  "sk_test_51OvnvN09UtBXmetzyMMzDcqBA39rtTedBiFXXz9QfDbJBXmyBoYjJ0ng8eFcgNPLufNu0Uf95AM4j2cl4eozJTN400LYBAfUkL"
);

app.get("/", (req, res) => {
  res.send("hello server");
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));
app.use(
  express.json({
    limit: "16kb",
  })
);

import { userRouter } from "./routes/users.routes.js";
import { doctorRouter } from "./routes/doctor.routes.js";
import { patientRouter } from "./routes/patient.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);




// stripe payment
app.post("/api/v1/create-checkout-session", async (req, res) => {
  const product = req.body;
  console.log(product.products.totalCost);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: product.products.totalCost * 100,
          product_data: {
            name: "Paying to MediCare",
            description: "Thank You For Support",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/success/${product.products._id}`,
    cancel_url: "http://localhost:5173/cancel",
  });

  res.json({ id: session.id });
});

export default app;
