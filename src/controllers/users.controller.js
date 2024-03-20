import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

// todo : RegisterUser , LogginUser , LogoutUser, GenerateAccessToken

// const registerUser = asyncHandler(async (req, res) => {
//   return res.status(200).json(new ApiResponse(200, {}, "Done"));
// });

const Roles = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  ADMIN: "admin",
};
const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessTokenWithID = async (userId) => {
  try {
    const currentUser = await User.findById(userId);
    const accessToken = await currentUser.generateAccessToken();
    console.log(accessToken);
    currentUser.token = accessToken;

    await currentUser.save({ validateBeforeSave: false });

    return accessToken;
  } catch (error) {
    throw new ApiError(500, "Token Not Generated");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // it is not protected route so no need of token
  // get the data from req,  validate the data

  try {
    const { email, fullName, password, role } = req.body;

    console.log(email);

    if (!email || !password || !fullName || !role) {
      throw new ApiError(400, {}, "All Feilds Are Required");
    }

    // email is unique, so check if user exist with same email id
    //if email exist throw error , otherwise move ahead
    const isUserExisted = await User.findOne({ email });

    if (isUserExisted) {
      throw new ApiError(400, {}, "User Already Exist");
    }

    // take the password and encrypt it done in user.controller

    // save the user
    const currentUser = await User.create({
      fullName: fullName,
      email: email,
      password: password,
      role: role,
    });

    // check if user is saved or not
    const createdUser = await User.findById(currentUser._id).select(
      "-password"
    );
    if (!createdUser) {
      throw new ApiError(500, "User Not Created Server Error");
    }

    // check the role
    // based on role create the user
    if (role === Roles.DOCTOR) {
      const doctor = await Doctor.create({
        userId: createdUser._id,
        role: Roles.DOCTOR,
      });
    } else if (role === Roles.PATIENT) {
      const patient = await Patient.create({
        userId: createdUser._id,
        role: Roles.PATIENT,
      });
      console.log(patient);
    }

    //return res without password
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Created"));
  } catch (error) {
    console.error("Error:", error);
    res.status(501).json(new ApiError(501, {}, error));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    // get the data , validate data
    const { email, password } = req.body;
    console.log(email);

    if (!email || !password) {
      throw new ApiError(400, {}, "All Fields Required");
    }

    // check if user exist or not
    const existedUser = await User.findOne({ email }).select("-password");

    if (!existedUser) {
      throw new ApiError(400, {}, "User not found");
    }

    // check the credential, match the password
    const matchPass = await existedUser.isPasswordCorrect(password);

    if (!matchPass) {
      throw new ApiError(401, {}, "User or Password does not match");
    }
    // generate access token
    const accessToken = await generateAccessTokenWithID(existedUser._id);

    // const loggedUser = await User.findById(existedUser._id).select("-password");
    console.log(existedUser._id);

    let loggedUser;
    if (existedUser.role === Roles.DOCTOR) {
      const userId = existedUser._id;
      await Doctor.findOne({ userId })
        .then((doctor) => {
          if (doctor) {
            loggedUser = doctor;
          } else {
            throw new ApiError(400, {}, "No User Found");
          }
        })
        .catch((err) => {
          console.error("Error finding doctor:", err);
        });
    } else if (existedUser.role === Roles.PATIENT) {
      const userId = existedUser._id;
      await Patient.findOne({ userId })
        .then((patient) => {
          if (patient) {
            loggedUser = patient;
          } else {
            throw new ApiError(400, {}, "No User Found");
          }
        })
        .catch((err) => {
          console.error("Error finding patient:", err);
        });
    } else {
      loggedUser = existedUser;
    }

    // send res
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, loggedUser, "user logged"));
  } catch (error) {
    console.error("Error:", error);
    res.status(501).json(new ApiError(501, {}, error));
  }
});

export { registerUser, loginUser };
