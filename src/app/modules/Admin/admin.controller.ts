import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  const query = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page","limit", "sortBy", "sortOrder"]);
  const result = await adminService.AllAdminGet(query, options);
  res.status(200).json({
    success: true,
    message: "Admin route",
    data: result,
  });
};

export const adminController = {
  getAllAdminFromDB,
};
