import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
    return adminController.createAdmin(req, res, next)

  }
 
);

export const userRoutes = router;
