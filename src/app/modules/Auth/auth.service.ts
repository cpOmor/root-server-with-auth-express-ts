/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import twilio from 'twilio';
import { TLoginUser, TReSetPassword } from './auth.interface';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import { TUserRole } from '../User/user.interface';
import { TEmailInfo } from '../../utils/utils.interface';
import sendEmail from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  // const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
  // checking if the user is already deleted
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password can not match !');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !!');
  }
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const sentOTP = async (contactNumber: string) => {
  const accountSid = config.twilioAccountSid;
  const authToken = config.twilioAuthToken;
  const twilioPhoneNumber = '+8801970299035';

  const client = twilio(accountSid, authToken);

  const generateOTP = () => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const otp = generateOTP();
  const message = await client.messages.create({
    body: 'You have an appointment with Owl, Inc. on Friday, November 3 at 4:00 PM. Reply C to confirm.',
    from: twilioPhoneNumber,
    to: contactNumber,
  });
  console.log(message, 'message');

  return `${message} your opt ${otp}`; // You might want to return the OTP or store it for validation
};

// const message = await  client.messages.create({
//   body: `Your OTP code is`,
//   from: "01970299035",
//   to: "+880018373911345",
// });

const activateUser = async (token: string) => {
  // checking if the token is missing
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (!decoded)
    throw new AppError(
      httpStatus.VARIANT_ALSO_NEGOTIATES,
      'Unable to verify user',
    );

  const isUser = await User.findOne({ email: decoded?.email });

  if (isUser as any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This email ${decoded.email} already assist`,
    );
  }
  const result = await User.create(decoded);
  return result;
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  // if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
  // throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { email } = decoded;
  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    email: user.email as string,
    role: user.role as TUserRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10d',
  );

  const emailData: TEmailInfo = {
    email: email,
    subject: 'Account Activation Email',
    html: `
      <body style="background-color: #f7fafc; display: flex; align-items: center; justify-content: center; height: 100vh;">
  <div style="background-color: white; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); border-radius: 0.5rem; padding: 1.5rem; max-width: 28rem; width: 100%;">
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #2d3748; margin-bottom: 1rem;">Hello ${email}</h2>
    <p style="color: #718096; margin-bottom: 1.5rem;">We're excited to have you get started. First, you need to activate your account. Just press the button below.</p>
    <a href="${config.client_url}/reset-password/${resetToken}" target="_blank" style="display: inline-block; background-color: #4299e1; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.25rem; text-decoration: none; transition: background-color 0.3s;">
      set password
    </a>
  </div>
</body>
    `,
    // html: `
    //   <h2>Hello ${email}</h2>

    //   <button>Please click here to <a href="${config.client_url}/reset-password/${resetToken}" target="_blank">Activate your account</a>.</button>
    // `,
  };
  // Send email with nodemailer
  await sendEmail(emailData as TEmailInfo);

  // const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;

  // sendEmail(user.email, resetUILink);

  return resetToken;
};

const resetPassword = async (payload: TReSetPassword) => {
  // checking if the user is exist
  if (!payload?.token) {
    throw new AppError(httpStatus.NOT_FOUND, 'You are unauthorize user !');
  }
  const decoded = verifyToken(
    payload?.token as string,
    config.jwt_refresh_secret as string,
  );
  const isFindUser = await User.findOne({ email: decoded?.email });

  if (!isFindUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = isFindUser?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = isFindUser?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  const jwtPayload = {
    email: user?.email as string,
    role: user?.role as TUserRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const isLoggedIn = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Pleas login');
  }
  return;
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  isLoggedIn,
  sentOTP,
  activateUser,
};
