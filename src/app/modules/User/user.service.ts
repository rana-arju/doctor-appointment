import { Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { IPaginationOptions } from "../../interfaces";
import { paginationHelper } from "../../helper/pagination";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

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

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};
const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
const updateMyProfie = async (user: IAuthUser, file: any, payload: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (file) {
    const uploadToCloudinary = (await fileUploader.uploadToCloudinary(
      file
    )) as CloudinaryUploadResult;
    payload.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: payload,
    });
  }

  return { ...profileInfo };
};
export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfie,
};
