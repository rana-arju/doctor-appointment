import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { UserStatus } from "@prisma/client";
import config from "../../../config";
import { generateToken, verifyToken } from "../../helper/jwtHelper";
const loginUser = async (payload: any) => {
  const isExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isExist) {
    throw new Error("User not found");
  }
  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isExist.password
  );
  if (!isPasswordMatch) {
    throw new Error("Password is incorrect");
  }

  const accessToken = generateToken(
    {
      id: isExist.id,
      email: isExist.email,
      role: isExist.role,
    },
    config.jwt.jwtSecret as Secret,
    config.jwt.jwtExpiration as string
  );

  const refreshToken = generateToken(
    {
      id: isExist.id,
      email: isExist.email,
      role: isExist.role,
    },
    config.jwt.jwtRefreshSecret as Secret,
    config.jwt.jwtRefreshExpiration as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isExist.needPasswordChange,
  };
};
const refreshUserToken = async (payload: any) => {
  let decode;
  try {
    decode = verifyToken(payload, config.jwt.jwtRefreshSecret as Secret);
  } catch (error) {
    throw new Error("you  are not authorized to access this resource");
  }

  const isExist = await prisma.user.findUnique({
    where: {
      email: decode.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isExist) {
    throw new Error("User not found");
  }
  const accessToken = generateToken(
    {
      id: isExist.id,
      email: isExist.email,
    },
    config.jwt.jwtSecret as Secret,
    config.jwt.jwtExpiration as string
  );

  return {
    accessToken,
    needChangePassword: isExist.needPasswordChange,
  };
};
export const authService = {
  loginUser,
  refreshUserToken,
};
