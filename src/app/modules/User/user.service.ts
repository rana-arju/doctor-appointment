import { Doctor, Patient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: any;
}

const createAdmin = async (file: any, payload: any) => {
  if (file) {
    const uploadCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as CloudinaryUploadResult;
    payload.admin.profilePhoto = uploadCloudinary?.secure_url;
  }

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
const createDoctor = async (file: any, payload: any): Promise<Doctor> => {
  if (file) {
    const uploadToCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as CloudinaryUploadResult;
    payload.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 10);

  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: payload.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const createPatient = async (file: any, payload: any): Promise<Patient> => {
  if (file) {
    const uploadedProfileImage = (await fileUploader.uploadToCloudinary(
      file
    )) as CloudinaryUploadResult;
    payload.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: payload.patient,
    });

    return createdPatientData;
  });

  return result;
};
export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
};
