/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from './user.model';
import { TUser } from './user.interface';
import config from '../../config';
import sendEmail from '../../utils/sendEmail';
import { TEmailInfo } from '../../utils/utils.interface';
import { createToken } from '../Auth/auth.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createUserIntoDB = async (payload: TUser, file : any) => {

  const isUser = await User.findOne({ email: payload?.email });
  if (isUser as any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This email ${payload.email} already assist`,
    );
  }
  payload.role = 'patient';
  const token = createToken(
    payload,
    config.jwt_access_secret as string,
    '10m' as string,
  );

  const emailData: TEmailInfo = {
    email: payload.email,
    subject: 'Account Activation Email',
    html: `
      <h2>Hello ${payload.email}</h2>
      
      <button>Please click here to <a href="${config.client_url}/activate/${token}" target="_blank">Activate your account</a>.</button>
    `,
  };
  // Send email with nodemailer
  await sendEmail(emailData as TEmailInfo);
};

const getUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const getUserFromDB = async (email: string) => {
  const result = await User.findOne({ email });

  return result;
};

const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'admin') {
    result = await User.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getUsersFromDB,
  getUserFromDB,
  getMe,
  changeStatus,
};
