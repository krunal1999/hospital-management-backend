import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctor", doctorRouter);


export default app;
