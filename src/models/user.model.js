import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        Type: String,
        required: [true, "username is required"],
        unique: true
    },
    firstName: {
        Type: String,
        required: [true, "firstName is required"]
    },
    lastName: {
        Type: String,
        required: [true, "lastName is required"]
    },
    email: {
        Type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        Type: String,
        required: [true, "password is required"],
    },
    status:{
        Type:String,
        enum:["active","inactive","suspended"],
        default:"active"
    }

}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model("User", userSchema)