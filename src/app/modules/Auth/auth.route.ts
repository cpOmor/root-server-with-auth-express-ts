import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/active',
  // validateRequest(AuthValidation.loginValidationSchema),
  // AuthControllers.isLoggedIn,
  // AuthControllers.isLoggedIn,
  AuthControllers.activateUser,
);

router.post(
  '/send-otp',
  // validateRequest(AuthValidation.loginValidationSchema),
  // AuthControllers.isLoggedIn,
  // AuthControllers.isLoggedIn,
  AuthControllers.sentOTP,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  // AuthControllers.isLoggedIn,
  // AuthControllers.isLoggedIn,
  AuthControllers.loginUser,
);

router.post(
  '/logout',
  // AuthControllers.isLoggedIn,
  AuthControllers.handleLogout
);

router.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  // validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  // validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
