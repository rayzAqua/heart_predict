import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

function getToken(email, mailChangePassword = false, role = "customer") {
  let minutes = 1200;
  if (mailChangePassword) minutes = 5;
  // require("dotenv").config();
  dotenv.config();

  var token = jsonwebtoken.sign(
    {
      email,
      role,
      isa: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * minutes,
    },
    process.env.JWT_SECRET
  );
  console.log("Passed!!");
  console.log("maked token:", email, role, token);

  return token;
}

function getRefeshToken(email, role = "customer") {
  let minutes = 4320;
  // require("dotenv").config();
  // Generate a refresh token
  // var jwt = require("jsonwebtoken");
  const refreshToken = jsonwebtoken.sign(
    {
      email,
      role,
      isa: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * minutes,
    },
    process.env.JWT_SECRET
  );

  console.log("maked refesh token:", email, role, refreshToken);

  return refreshToken;
}

export { getToken, getRefeshToken };
