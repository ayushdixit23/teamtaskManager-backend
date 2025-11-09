import { verifyToken } from "../utils/jwt.js";
import { ErrorResponse } from "./responseHandler.js";
import asyncHandler from "./tryCatch.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ErrorResponse("Not authorized, token missing", 401);
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        throw new ErrorResponse("Invalid or expired token", 401);
    }

    (req as any).user = decoded;
    next();
}); 