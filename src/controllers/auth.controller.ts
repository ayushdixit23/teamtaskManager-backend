import {
  ErrorResponse,
  SuccessResponse,
} from "../middlewares/responseHandler.js";
import asyncHandler from "../middlewares/tryCatch.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findByEmail(email);
  if (user) {
    throw new ErrorResponse("User already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  return new SuccessResponse("User created successfully", newUser, 201).send(
    res
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ErrorResponse("Invalid password", 401);
  }
  return new SuccessResponse("Login successful", user, 200).send(res);
});
