import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
        trim:true
    },
    firstName: {
        type: String,
        required: [true, "firstName is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "lastName is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active"
    }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
