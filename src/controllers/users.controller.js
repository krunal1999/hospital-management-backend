import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Doctor } from "../models/doctor.model.js";

// todo : RegisterUser , LogginUser , LogoutUser, GenerateAccessToken

// const registerUser = asyncHandler(async (req, res) => {
//   return res.status(200).json(new ApiResponse(200, {}, "Done"));
// });

const Roles = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  ADMIN: "admin",
};

const registerUser = asyncHandler(async (req, res) => {
  // it is not protected route so no need of token
  // get the data from req,  validate the data

  try {
    const { email, fullName, password, role } = req.body;

    console.log(email);

    // if (!email || !password || !fullName || !role) {
    //   throw new ApiError(400, {}, "All Feilds Are Required");
    // }

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
      });
      console.log(doctor)
    }
    console.log(createdUser)

    //return res without password
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Created"));
  } catch (error) {
    console.error('Error:', error);
    res.status(501).json(new ApiError(501, {}, "User Not Created"));
  }
});


const loginUser = asyncHandler(async(req,res)=>{

  console.log(req.body)

})
export { registerUser,loginUser };
