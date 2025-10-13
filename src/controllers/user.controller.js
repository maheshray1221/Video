import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccesseAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = generateAccessToken()
        const refreshToken = generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { userName, email, fullName, password } = req.body;
    console.log("userName :", userName, email);


    // validation - not empty
    if (
        [userName, email, fullName, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "all fields are required")
    }

    // check if user already exists: using username, enail
    const existedUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existedUser) {
        throw new ApiError(409, "user alredy have account with email or username")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required");
    }

    // upload them to Cloudinary , and check avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // check avatar
    console.log("avatar", avatar)
    if (!avatar) {
        throw new ApiError(400, "avatar file is required");
    }

    // create user object - create entry in db
    const user = await User.create({
        email,
        password,
        fullName,
        userName: userName.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "somthing went wrong while registering the User");
    }

    // return response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    // req.body - data lo
    const { userName, password, email } = req.body;
    console.log("userName = ", userName);

    // username or email base login setup
    if (!userName || !email) {
        throw new ApiError(400, "userName or email is required");
    }
    // find user
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    // access Token and refresh token send
    const { accessToken, refreshToken } = await generateAccesseAndRefreshToken(user._id)
    const logedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    // send cokie
    const options = {
        httpOnly: true,
        secure: true,
    }
    // res
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            201,
            {
                user: logedInUser, refreshToken, accessToken
            },
            "User loged in successfully"
        ))
})

const logedOut = asyncHandler(async (req, res) => {
    const { password } = req.params
})

export { registerUser, loginUser }