import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { sendMail } from "../controllers/emailSend.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/sendmail").post(sendMail);

//secure routes
userRouter.route("/logout").post(verifyJWT, logout);

export { userRouter };
