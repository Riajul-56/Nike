import {
  APP_URL,
  GOOGLE_ACCESS_TOKEN_URL,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_SCOPES,
  GOOGLE_OAUTH_URL,
  JWT_SECRET,
  GOOGLE_TOKEN_INFO_URL,
} from '../constants.js';
import { User } from '../../models/index.model.js';
import ApiError from '../utils/apiError.js';
import ApiSuccess from '../utils/apiSuccess.js';
import { asyncHandler } from '../utils/asynceHandler.js';
import { fileUpload } from '../utils/fileupload.js';
import { sendMail, forgotPasswordFormat, verifyEmailFormat } from '../utils/mail.js';
import jwt from 'jsonwebtoken';
import { avatarUploadSchema } from '../validators/user.validator.js';

//============================================ Sign Up =======================================================================//

const signup = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    throw ApiError.badRequest('Username already exists');
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw ApiError.badRequest('Email already exists');
  }

  const createdUser = await User.create({ username, name, email, password });

  const user = await User.findById(createdUser._id).select(
    '-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires'
  );

  const token = user.jwtToken();
  const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`;
  sendMail({
    email,
    subject: 'Verify you email',
    mailFormat: verifyEmailFormat(name, verifyUrl),
  });

  return res.status(200).json(ApiSuccess.created('User created', user));
});

//============================================ Email Verify =======================================================================//

const verifymail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw ApiError.badRequest('Token is required');
  }

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired access token.');
  }

  const user = await User.findById(decodeToken.id).select(
    '-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires'
  );
  if (!user) {
    throw ApiError.notFound('User not Found');
  }
  if (user.isVerified) {
    return res.status(200).json(ApiSuccess.ok('User already verified', user));
  } else {
    user.isVerified = true;
    await user.save();
    return res.status(200).json(ApiSuccess.ok('User verified', user));
  }
});

//============================================ Sign In =======================================================================//

const sigin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.notFound('Invalid credentials');
  }

  if (!user.isVerified === false) {
    throw ApiError.forbidden('Email is not verified');
  }

  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  return res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })

    .status(200)
    .json(ApiSuccess.ok('User Signed in', { accessToken, refreshToken }));
});

//============================================ Sign Out =======================================================================//

const signout = asyncHandler(async (_req, res) => {
  return res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(ApiSuccess.ok('User signed out'));
});

//============================================ Sign in with Google =======================================================================//
const signinWithGoogle = asyncHandler(async (req, res) => {
  const state = 'some_state';
  const scopes = GOOGLE_OAUTH_SCOPES.join(' ');
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

//============================================ Google Call Back =======================================================================//

const googleCallBack = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const data = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
  };

  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const access_token_data = await response.json();

  const { id_token } = access_token_data;

  const token_info_response = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);

  const token_info = await token_info_response.json();

  const createdUser = await User.findOneAndUpdate(
    {
      email: token_info.email,
    },
    {
      username: (token_info.name + Math.floor(1000 + Math.random() * 9000)).replace('', ''),
      name: token_info.name,
      email: token_info.email,
      isVerified: token_info.email_verified,
      accountType: 'google',
      avatar: {
        url: token_info.picture,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  const user = await User.findById(createdUser._id).select(
    '-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires'
  );

  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .status(token_info_response.status)
    .json(ApiSuccess.ok('User signed in', { accessToken, refreshToken }));
});

//============================================ User Update =======================================================================//

const updateUser = asyncHandler(async (req, res) => {
  const { username, name, email } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.username !== username) {
    const isUsernameExists = await User.findOne({ username });
    if (isUsernameExists) {
      throw ApiError.badRequest('Username already exists');
    } else {
      user.username = username;
    }
  }

  if (user.email !== email) {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      throw ApiError.badRequest('Email already exists');
    } else {
      user.isVerified = false;
      user.email = email;
      const token = user.jwtToken();
      const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`;
      sendMail({
        email,
        subject: 'Verify you email',
        mailFormat: verifyEmail(name, verifyUrl),
      });
    }
  }
  user.name = name;
  await user.save();
  return res.status(300).json(ApiSuccess.ok('User Updated', user));
});

//============================================ Update password =======================================================================//

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (oldPassword === newPassword) {
    throw ApiError.badRequest('New password can not be same as old password');
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw ApiError.notFound('Old password us incorrect');
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json(ApiSuccess.ok('Password updated'));
});

//============================================ Forgot Password =======================================================================//

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound('User not found.');
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  sendMail({
    email,
    subject: 'reset password',
    mailFormat: forgotPasswordFormat(user.name, otp),
  });
  user.passwordResetToken = otp;
  user.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  await user.save();
  return res.status(200).json(ApiSuccess.ok('OTP sent.'));
});

//============================================ Validate OTP =======================================================================//

const validateOpt = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({ passwordResetToken: otp });
  if (!user) {
    throw ApiError.notFound('Invalid otp');
  }
  if (user.passwordResetExpires < Date.now()) {
    throw ApiError.notFound('Otp expired');
  }
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  return res.status(200).json(ApiSuccess.ok('Otp verified'));
});

//============================================ Reset Password =======================================================================//

const resetpassword = asyncHandler(async (req, res) => {
  const { otp, password } = req.body;
  const user = await User.findOne({ passwordResetToken: otp });
  if (!user) {
    throw ApiError.notFound('Invalid otp');
  }
  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  return res.status(200).json(ApiSuccess.ok('Password reset successfully'));
});

//============================================ Avatar Uploaded =======================================================================//

const avatarUpload = asyncHandler(async (req, res) => {
  const avatar = req.file;
  const avatarValidation = avatarUploadSchema.safeParse(avatar);
  if (avatarValidation.error) {
    throw ApiError.badRequest('Avatar is required');
  }
  const user = req.user;
  const result = await fileUpload(avatar.path, {
    folder: 'avatar',
    use_filename: true,
    overwrite: true,
    resource_type: 'image',
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face', radius: 'max' }],
    public_id: req.user._id,
  });
  user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  return res.status(200).json(ApiSuccess.ok('Avatar uploaded', user));
});

//============================================ find user =======================================================================//

const me = asyncHandler(async (req, res) => {
  return res.status(200).json(ApiSuccess.ok('User found', req.user));
});

export {
  signup,
  verifymail,
  sigin,
  signout,
  updateUser,
  updatePassword,
  forgotPassword,
  validateOpt,
  resetpassword,
  signinWithGoogle,
  googleCallBack,
  avatarUpload,
  me,
};
