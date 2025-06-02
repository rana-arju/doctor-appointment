import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import generateToken from "../../helper/jwtHelper";
import { UserStatus } from "@prisma/client";
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
    },
    "4c3e40b6-de26-454d-b5ae-8e2dcf512277",
    "1h"
  );
  const refreshToken = generateToken(
    {
      id: isExist.id,
      email: isExist.email,
    },
    "4c3e40b6-de26-454d-b5ae-8e2dcf512277",
    "365d"
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
    decode = jwt.verify(payload, "4c3e40b6-de26-454d-b5ae-8e2dcf512277") as {
      id: string;
      email: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    throw new Error("you  are not authorized to access this resource");
  }

  
  const isExist = await prisma.user.findUnique({
    where: {
      email: decode.email,
      status: UserStatus.ACTIVE
    },
  });
  console.log("User found:", isExist);
  
  if (!isExist) {
    throw new Error("User not found");
  }
  const accessToken = generateToken(
    {
      id: isExist.id,
      email: isExist.email,
    },
    "4c3e40b6-de26-454d-b5ae-8e2dcf512277",
    "1h"
  );
  return {
    accessToken,
    needChangePassword: isExist.needPasswordChange,
  };
}
export const authService = {
  loginUser,
  refreshUserToken,
};
