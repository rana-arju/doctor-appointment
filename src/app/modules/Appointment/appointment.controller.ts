import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";
import { appointmentFilterableFields } from "./appointment.constant";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    const result = await AppointmentService.createAppointment(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Appointment booked successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request , res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AppointmentService.getMyAppointment(
      user as IAuthUser,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Appointment retrive successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllFromDB,
};
