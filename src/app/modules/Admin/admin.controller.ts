import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  const query = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await adminService.AllAdminGet(query, options);
  res.status(200).json({
    success: true,
    message: "Admins fetched successfully",
    meta: result.meta,
    data: result.data,
  });
};
const getSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.getSingleAdmin(id);
    res.status(200).json({
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
    return;
  }
};
export const adminController = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
};
