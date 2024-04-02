// var nodemailer = require('nodemailer');
import nodemailer from "nodemailer";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "krunaldhavle1546@gmail.com",
    pass: "jahh zgsd pont raqs",
  },
});

let mailOptions = {
  from: "krunaldhavle1546@gmail.com",
  to: "krunaldhavle1999@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

export const sendMail = async (req, res) => {
  //   console.log(req.body);
  mailOptions = req.body;
  //   console.log(mailOptions)

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json(new ApiResponse(200, {}, " successfully"));
  } catch (error) {
    console.log(error);
    res.status(501).json(new ApiError(501, {}, "Error in sending mail"));
  }
};
