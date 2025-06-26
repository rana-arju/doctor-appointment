"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("./doctor.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validationRequest_1 = require("../../../middlewares/validationRequest");
const doctor_validation_1 = require("./doctor.validation");
const router = express_1.default.Router();
// task 3
router.get("/", doctor_controller_1.DoctorController.getAllFromDB);
//task 4
router.get("/:id", doctor_controller_1.DoctorController.getByIdFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR), (0, validationRequest_1.validateRequest)(doctor_validation_1.DoctorValidation.update), doctor_controller_1.DoctorController.updateIntoDB);
//task 5
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), doctor_controller_1.DoctorController.deleteFromDB);
// task 6
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), doctor_controller_1.DoctorController.softDelete);
exports.DoctorRoutes = router;
