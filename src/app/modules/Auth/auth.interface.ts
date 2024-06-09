import { TUserRole } from "../User/user.interface";

export type TLoginUser = {
  email: string;
  password: string;
};
export type TReSetPassword = {
  token: string;
  password: string;
};
export type TJwtPayload = {
  email: string;
  role: TUserRole;
};
