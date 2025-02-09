import AsyncHandler from "../utils/AsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ResponseHandler from "../utils/ResponseHandler.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const signup = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "All fields are required!")
        )   
    }

    if (name?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Name shouldn't be empty!")
        )  
    }

    if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email?.trim())) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Email shouldn't be empty! | Invalid Email!")
        )
    }

    if (password?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password shouldn't be empty!")
        )  
    }

    if (password?.trim()?.length < 8 || password?.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password length should be between 8 to 16 characters!")
        )
    }

    const existedUser = await User.findOne({
        email: email?.trim()?.toLowerCase()
    })

    if (existedUser) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "User existed! Go for login!")
        )  
    }

    const user = await User.create({
        name: name?.trim(),
        email: email?.trim()?.toLowerCase(),
        password: password?.trim()
    })

    const createdUser = await User.findById(user?._id).select("-password")

    if (!createdUser) {
        return res
        .status(500)
        .json(
            new ErrorHandler(500, "Something went wrong while creating user profile!")
        )  
    }

    return res
    .status(201)
    .json(
        new ResponseHandler(200, createdUser, "User created successfully")
    )
})

const signin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "All fields are required!")
        )   
    }

    if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email?.trim())) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Email shouldn't be empty! | Invalid Email!")
        )
    }

    if (password?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password shouldn't be empty!")
        )
    }

    if (password?.trim()?.length < 8 || password?.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password length should be between 8 to 16 characters!")
        )
    }

    const existedUser = await User.findOne({
        email: email?.trim()?.toLowerCase()
    })

    if (!existedUser) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "User not found! Go for signup!")
        )
    }

    const isValidPassword = await existedUser.validatePassword(password?.trim())

    if (!isValidPassword) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Invalid password!")
        )
    }

    const accessToken = existedUser.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ResponseHandler(
            200, 
            {
                "name": existedUser?.name,
                "email": existedUser?.email,
                "_id": existedUser?._id
            }, 
            "User logged in successfully"
        )
    )
})

const currentUser = AsyncHandler(async (req, res) => {
    const currentUser = await User.findById(req?.user?._id).select("-password")

    return res
    .status(200)
    .json(
        new ResponseHandler(200, currentUser, "User profile fetched successfully")
    )
})

const logout = AsyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        SameSite: "None"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(
        new ResponseHandler(200, {}, "User logged out successfully")
    )
})

const updateUserName = AsyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Name is required!")
        )
    }

    if (name?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Name shouldn't be empty!")
        )
    }

    const updatedUser = await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $set: {
                name: name?.trim()
            }
        },
        {
            new: true
        }
    ).select("-password")

    if (!updatedUser) {
        return res
        .status(500)
        .json(
            new ErrorHandler(500, "Something went wrong while updating user profile!")
        )
    }

    return res
    .status(200)
    .json(
        new ResponseHandler(200, updatedUser, "User's name updated successfully")
    )
})

const updateProfilePassword = AsyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body

    if (!newPassword || !confirmPassword) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "All fields are required!")
        )
    }

    if (newPassword?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "New password shouldn't be empty!")
        )
    }

    if (confirmPassword?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Confirm password shouldn't be empty!")
        )
    }

    if (newPassword?.trim()?.length < 8 || newPassword?.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password length should be between 8 to 16 characters!")
        )
    }

    if (confirmPassword?.trim()?.length < 8 || confirmPassword?.trim()?.length > 16) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Password length should be between 8 to 16 characters!")
        )
    }

    if (newPassword?.trim() !== confirmPassword?.trim()) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "New password and confirm password doesn't match!")
        )
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $set: {
                password: hashedPassword
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ResponseHandler(200, {}, "User's password updated successfully")
    )
})

export {
    signup,
    signin,
    currentUser,
    logout,
    updateUserName,
    updateProfilePassword
}