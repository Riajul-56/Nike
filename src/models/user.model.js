import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        require: [true, "Name is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
        type: date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
