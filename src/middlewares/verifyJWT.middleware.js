import jsonwebtoken from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, {}, "Unauthorized Request");

    const decodedToken = await jsonwebtoken.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.user._id;
  const role = req.user.role;

  console.log("role in restrict", role);
  console.log("user id in req", userId);

  if (!roles.includes(role)) {
    return res
      .status(401)
      .json({ success: false, message: "You're not authorized" });
  }

  next();
};

// Middleware to authenticate admin access
export const adminAuth = restrict(["admin"]);

// Middleware to restrict doctor access
export const doctorAuth = restrict(["doctor", "admin"]);

// Middleware to restrict patient access
// export const patientAuth = restrict(["patient", "admin"]);
export const patientAuth = restrict(["patient", "admin"]);
