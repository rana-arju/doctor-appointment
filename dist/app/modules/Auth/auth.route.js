"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthController.loginUser);
router.post("/refresh-token", auth_controller_1.AuthController.refreshUserToken);
router.post("/password-change", (0, auth_1.default)(client_1.UserRole.ACCOUNTANT, client_1.UserRole.ADMIN, client_1.UserRole.USER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.DOCTOR), auth_controller_1.AuthController.passwordChange);
router.post("/forget-password", auth_controller_1.AuthController.forgetPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.authRoutes = router;
