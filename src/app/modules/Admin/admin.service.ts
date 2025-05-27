import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AllAdminGet = async (params: any) => {
  const {searchTerm, ...filterData} = params;
  const addCondition: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields: (keyof Prisma.AdminWhereInput)[] = [
    'name',
    'email',
  ]
  if (searchTerm) {
    addCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
    
  }

  if (Object.keys(filterData).length > 0) {
    addCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereCondition: Prisma.AdminWhereInput = {
    AND: addCondition
  }
  const result = await prisma.admin.findMany({
    where:  whereCondition
    
  });
  return result;
};

export const adminService = {
  AllAdminGet,
};
