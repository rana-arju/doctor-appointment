import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

const createAdmin = async (file: any, payload: any) => {

  if (file) {
    const uploadCloudinary = await fileUploader.uploadToCloudinary(file) as CloudinaryUploadResult;
    payload.admin.profilePhoto = uploadCloudinary?.secure_url;
    
  }
  console.log("uploadCloudinary", payload);

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

  // // Logic to create a user
   return result;
};

export const adminServices = {
  createAdmin,
};
