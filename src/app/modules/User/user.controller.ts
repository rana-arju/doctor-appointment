import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req.file, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req.file, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created successfuly!",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req.file, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created successfuly!",
    data: result,
  });
});
export const adminController = {
  createAdmin,
  createDoctor,
  createPatient
};
