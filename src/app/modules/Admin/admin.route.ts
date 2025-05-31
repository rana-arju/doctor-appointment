import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { z, AnyZodObject } from "zod";
import { validateRequest } from "../../../middlewares/validationRequest";
import { adminUpdate } from "./admin.validation";

const router = express.Router();


router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getSingleAdminFromDB);
router.patch(
  "/:id",
  validateRequest(adminUpdate),
  adminController.updateSingleAdminFromDB
);
router.delete("/:id", adminController.deleteSingleAdminFromDB);
router.delete("/soft/:id", adminController.softDeleteSingleAdminFromDB);

export const adminRoutes = router;
