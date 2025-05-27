import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  
  const result = await adminService.AllAdminGet(req.query);
  res.status(200).json({
    success: true,
    message: "Admin route",
    data: result,
  });
};

export const adminController = {
  getAllAdminFromDB,
};
