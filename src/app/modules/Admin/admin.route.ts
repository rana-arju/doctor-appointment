import express from "express";
import { adminController } from "./admin.controller";
const router = express.Router();
router.get("/", adminController.getAllAdminFromDB);
router.get("/:id", adminController.getSingleAdminFromDB);
router.patch("/:id", adminController.updateSingleAdminFromDB);
router.delete("/:id", adminController.deleteSingleAdminFromDB);

export const adminRoutes = router;
