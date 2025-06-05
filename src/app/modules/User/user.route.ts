import express from "express";
import { adminController } from "./user.controller";
import { UserRole } from "@prisma/client";

import auth from "../../../middlewares/auth";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.createAdmin
);

export const userRoutes = router;
