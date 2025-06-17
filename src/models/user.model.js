import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from '../constants.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      require: [true, 'Name is required'],
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
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    accountType: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    avatar: {
      url: {
        type: String,
        default: 'null',
      },
      public_id: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.jwtToken = function () {
  return jwt.sign({ id: this._id, username: this.username, email: this.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

userSchema.methods.accessToken = function () {
  return jwt.sign(
    { id: this.id, username: this.username, email: this.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

userSchema.methods.refreshToken = function () {
  return jwt.sign(
    { id: this.id, username: this.username, email: this.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
