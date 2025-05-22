import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants.js";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
        require: [true, "Name is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    }
}, { timestamps: true });

userSchema.pre("Save", async function (next) {
    if (!this.isModified("password") || !this.password)
        return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.jwtToken = function () {
    return jwt.sign({ id: this._id, username: this.username, email: this.email },JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

export const User = mongoose.models.User || mongoose.model("User", userSchema);
