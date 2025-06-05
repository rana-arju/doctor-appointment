import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { UserStatus } from "@prisma/client";
import config from "../../../config";
import { generateToken, verifyToken } from "../../helper/jwtHelper";
import ApiError from "../../errors/ApiError";
import emailSender from "./emailSender";
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
const passwordChange = async (userData: any, payload: any) => {
  console.log(payload);

  if (!userData.id || !userData.email) {
    throw new ApiError(400, "User data is not provided");
  }
  const isExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
      id: userData.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isExist) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.oldPassword,
    isExist.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(400, "Creadentials are not valid");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: { id: isExist.id },
    data: { password: hashedPassword, needPasswordChange: false },
  });

  return { message: "Password changed successfully" };
};

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, status: UserStatus.ACTIVE },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = generateToken(
    { id: user.id, email: user.email },
    config.jwt.jwtSecret as Secret,
    "10m"
  );
  const resetUrl = `${config.app.baseUrl}/reset-password?id=${user.id}&token=${resetToken}`;
  // Here you would typically send the reset token to the user's email
  // For example, using a mail service
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
      <h2 style="color: #2d8cff;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for your Medical Appointment account.</p>
      <p>
        Click the button below to reset your password. This link will expire in 10 minutes.
      </p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2d8cff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <hr style="margin: 32px 0;">
      <p style="font-size: 14px; color: #888;">Thank you,<br>Medical Appointment Team</p>
    </div>
  `;
  await emailSender(email, emailHtml);

  return { resetUrl };
};
const resetPassword = async (token: string, payload: any) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id: payload?.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isExist) {
    throw new Error("User not found");
  }
  const isValid = verifyToken(token, config.jwt.jwtSecret as Secret);
  if (!isValid) {
    throw new ApiError(401, "Unauthorized");
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};
export const authService = {
  loginUser,
  refreshUserToken,
  passwordChange,
  forgetPassword,
  resetPassword,
};
