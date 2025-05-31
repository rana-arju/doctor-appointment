import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../helper/pagination";
import prisma from "../../../shared/prisma";
// Get all admins with pagination, sorting, and filtering
const AllAdminGet = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const addCondition: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    addCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    addCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
          mode: "insensitive",
        },
      })),
    });
  }
  addCondition.push({
      isDeleted: false, // Ensure we only get non-deleted admins
    });
  const whereCondition: Prisma.AdminWhereInput = {
    AND: addCondition,
  };
  
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: result,
  };
};

//get single admin by id
const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false, // Ensure we only get non-deleted admins
    },
  });
  if (!result) {
    throw new Error("Admin not found");
  }
  return result;
};
// single admin update
const updateSingleAdmin = async (id: string, data: Partial<Admin>): Promise<Admin> => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false, // Ensure we only update non-deleted admins
    },
  });
  if (!isExist) {
    throw new Error("Admin not found");
  }
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
//Delete single admin
const deleteSingleAdmin = async (id: string) :Promise<Admin | null> => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false, // Ensure we only delete non-deleted admins
    },
  });
  if (!isExist) {
    throw new Error("Admin not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });
    return deletedAdmin;
  });
  return result;
};

//Delete single admin
const softDeleteSingleAdmin = async (id: string): Promise<Admin | null> => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new Error("Admin not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedAdmin;
  });
  return result;
};
export const adminService = {
  AllAdminGet,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  softDeleteSingleAdmin,
};
