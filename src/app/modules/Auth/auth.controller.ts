import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TReSetPassword } from './auth.interface';

const activateUser = catchAsync(async (req, res) => {
  const result = await AuthServices.activateUser(req.body.token as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resignation in successfully!',
    data: result,
  });
});

const sentOTP = catchAsync(async (req, res) => {
  const result = await AuthServices.sentOTP(req.body.contactNumber as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Please check SMS`,
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Check your (${req.body.email}) mail! `,
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  

  const result = await AuthServices.resetPassword(req.body as TReSetPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

const isLoggedIn = catchAsync(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  // console.log(accessToken)
  if (accessToken) {
    throw new Error('User already login');
  }
  next();
});

const handleLogout = catchAsync(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logout is successfully!',
    data: '',
  });
});

export const AuthControllers = {
  loginUser,
  sentOTP,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  isLoggedIn,
  activateUser,
  handleLogout,
};
