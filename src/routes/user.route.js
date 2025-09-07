import e from 'express';
import validationMiddleware from '../middlewares/validator.middleware.js';

import {
  avatarUpload,
  forgotPassword,
  googleCallBack,
  me,
  resetpassword,
  sigin,
  signinWithGoogle,
  signout,
  signup,
  updatePassword,
  updateUser,
  validateOpt,
  verifymail,
} from '../controllers/user.controller.js';

import {
  userForgotPasswordOtpSchema,
  userForgotPasswordSchema,
  userPasswordUpdateSchema,
  userResetPasswordSchema,
  userSigninSchema,
  userSignupSchema,
  userUpdateSchema,
} from '../validators/user.validator.js';

import auth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/fileUpload.middleware.js';

const router = e.Router();

router.post('/signup', validationMiddleware(userSignupSchema), signup);

router.get('/verify', verifymail);

router.post('/sigin', validationMiddleware(userSigninSchema), sigin);

router.get('/signout', auth, signout);

router.post('/update', auth, validationMiddleware(userUpdateSchema), updateUser);

router.post(
  '/update-password',
  auth,
  validationMiddleware(userPasswordUpdateSchema),
  updatePassword
);

router.post('/forgot-password', validationMiddleware(userForgotPasswordSchema), forgotPassword);

router.post('/verify-otp', validationMiddleware(userForgotPasswordOtpSchema), validateOpt);

router.post('/reset-password', validationMiddleware(userResetPasswordSchema), resetpassword);

router.get('/google-signin', signinWithGoogle);

router.get('/google/callback', googleCallBack);

router.post('/avatar-upload', auth, upload.single('avatar'), avatarUpload);

router.get('/me', auth, me);

export default router;
