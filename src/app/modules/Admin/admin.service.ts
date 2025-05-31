import { Prisma } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../helper/pagination";
import prisma from "../../../shared/prisma";
import { get } from "http";
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
const getSingleAdmin = async (id: string) => { 
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  })
  if (!result) {
    throw new Error("Admin not found");
  }
  return result;
}

export const adminService = {
  AllAdminGet,
  getSingleAdmin,
};
