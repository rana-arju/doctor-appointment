import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";
const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllFromDB
);
router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createDoctor(req, res, next);
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userController.createPatient(req, res, next);
  }
);

export const userRoutes = router;
