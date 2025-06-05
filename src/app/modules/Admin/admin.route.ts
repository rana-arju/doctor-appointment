import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { z, AnyZodObject } from "zod";
import { validateRequest } from "../../../middlewares/validationRequest";
import { adminUpdate } from "./admin.validation";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllAdminFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getSingleAdminFromDB
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminUpdate),
  adminController.updateSingleAdminFromDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.deleteSingleAdminFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.softDeleteSingleAdminFromDB
);

export const adminRoutes = router;
