import asyncHandler from "../middlewares/tryCatch.js";
import { ErrorResponse, SuccessResponse } from "../middlewares/responseHandler.js";
import User from "../models/user.models.js";

export const me = asyncHandler(async (req, res) => {
    const id = req.user?.id;
    if (!id) {
        throw new ErrorResponse("Unauthorized", 401);
    }
    const user = await User.findById(id);
    if (!user) {
        throw new ErrorResponse("User not found", 404);
    }
    return new SuccessResponse("User fetched successfully", user, 200).send(res);
});