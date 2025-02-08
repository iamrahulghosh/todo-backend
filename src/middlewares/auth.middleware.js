import AsyncHandler from "../utils/AsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ResponseHandler from "../utils/ResponseHandler.js";
import User from "../models/user.model.js"
import JWT from "jsonwebtoken"

const auth = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            return res
            .status(401)
            .json(new ErrorHandler(401, "Unauthorized!"))
        }
    
        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password")
    
        if (!user) {
            return res
            .status(400)
            .json(
                new ErrorHandler(400, "Unauthorized! User not found!")
            )
        }
    
        req.user = user
        next()
    } catch (error) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Unauthorized!")
        )
    }
})

export default auth