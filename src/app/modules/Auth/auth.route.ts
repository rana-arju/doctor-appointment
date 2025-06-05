import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();
router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshUserToken);
router.post(
  "/password-change",
  auth(
    UserRole.ACCOUNTANT,
    UserRole.ADMIN,
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.DOCTOR
  ),
  AuthController.passwordChange
);
router.post(
  "/forget-password",

  AuthController.forgetPassword
);

export const authRoutes = router;
