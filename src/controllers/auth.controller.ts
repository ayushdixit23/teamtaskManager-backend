import {
  ErrorResponse,
  SuccessResponse,
} from "../middlewares/responseHandler.js";
import asyncHandler from "../middlewares/tryCatch.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { NODE_ENV, JWT_ACCESS_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY_MS } from "../config/env.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ErrorResponse("All fields are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ErrorResponse("Invalid email format", 400);
  }

  if (password.length < 8) {
    throw new ErrorResponse("Password must be at least 8 characters", 400);
  }

  const user = await User.findByEmail(email);
  if (user) {
    throw new ErrorResponse("A user with this email already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  return new SuccessResponse("User created successfully", newUser, 201).send(
    res
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorResponse("All fields are required", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ErrorResponse("Invalid email format", 400);
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ErrorResponse("Invalid password", 401);
  }
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name
  }
  const accessToken = generateToken(userData, JWT_ACCESS_TOKEN_EXPIRY);
  const refreshToken = generateToken(userData, JWT_REFRESH_TOKEN_EXPIRY);

  const responseData = {
    user: {
      ...userData,
      image_url: user.image_url
    },
    token: accessToken,
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: JWT_REFRESH_TOKEN_EXPIRY_MS,
  });
  
  return new SuccessResponse("Login successful", responseData, 200).send(res);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ErrorResponse("Refresh token is required", 400);
  }
  const decoded = verifyToken(refreshToken);

  if (!decoded) {
    throw new ErrorResponse("Invalid or expired refresh token", 403);
  }

  const user = await User.findByEmail(decoded.email);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const newAccessToken = generateToken(userData, JWT_ACCESS_TOKEN_EXPIRY);
  const newRefreshToken = generateToken(userData, JWT_REFRESH_TOKEN_EXPIRY);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: JWT_REFRESH_TOKEN_EXPIRY_MS,
  });
  return new SuccessResponse("Refresh token successful", {
    token: newAccessToken,
  }, 200).send(res);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });
  return new SuccessResponse("Logout successful", null, 200).send(res);
});