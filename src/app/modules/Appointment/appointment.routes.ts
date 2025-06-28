import express from "express";
import { AppointmentController } from "./appointment.controller";
import { UserRole } from "@prisma/client";
import auth from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validationRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

/**
 * ENDPOINT: /appointment/
 *
 * Get all appointment with filtering
 * Only accessable for Admin & Super Admin
 */
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AppointmentController.getAllFromDB
);

router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
