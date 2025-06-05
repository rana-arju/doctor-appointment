import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

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
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await userServices.getMyProfile(user as IAuthUser);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfie = catchAsync(
  async (req: Request , res: Response) => {
    const user = req.user;
    const file = req.file;
    const userData = req.body

    const result = await userServices.updateMyProfie(user as IAuthUser, file, userData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);
export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfie
};
