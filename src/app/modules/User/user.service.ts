import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (payload: any) => {
  const hashPassword: string = await bcrypt.hash(payload.password, 10);
  const userData = {
    email: payload.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (txc: any) => {
    await txc.user.create({
      data: userData,
    });
    const createdAdmin = await txc.admin.create({
      data: payload.admin,
    });
    return createdAdmin;
  });
  console.log(hashPassword);

  // Logic to create a user
  return result;
};

export const adminServices = {
  createAdmin,
};
