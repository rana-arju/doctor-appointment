import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  const query = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await adminService.AllAdminGet(query, options);
  sendResponse(res, {
    statusCode: 200,
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
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins fetched successfully",
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
const updateSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await adminService.updateSingleAdmin(id, data);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin updated successfully",
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
const deleteSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteSingleAdmin(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
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
const softDeleteSingleAdminFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Soft delete admin with ID:", id);

    const result = await adminService.softDeleteSingleAdmin(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admins fetched successfully",
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
  updateSingleAdminFromDB,
  deleteSingleAdminFromDB,
  softDeleteSingleAdminFromDB,
};
