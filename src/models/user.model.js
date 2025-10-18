import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

        },
        password: {
            type: String,
            required: true,
            unique: true,

        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        avatar: {
            type: String,  // cloudinary url
            required: true,
        },
        coverImage: {
            type: String,  // cloudinary url


        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video",
            }
        ],
        refreshToken: {
            type: String,
        }
    }, { timestamps: true }
);

// convert password in hashing form 
userSchema.pre("save", async function (next) {  // work like middleware
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// coustom method for check password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generate Access Token using coustom method
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            // payload
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
// Generate Refresh Token using coustom method
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            // payload
            _id: this._id,
        },
        // secret key
        process.env.REFRESH_TOKEN_SECRET,
        {
            // expires
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);

