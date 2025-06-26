"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../helper/jwtHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isExist) {
        throw new Error("User not found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, isExist.password);
    if (!isPasswordMatch) {
        throw new Error("Password is incorrect");
    }
    const accessToken = (0, jwtHelper_1.generateToken)({
        id: isExist.id,
        email: isExist.email,
        role: isExist.role,
    }, config_1.default.jwt.jwtSecret, config_1.default.jwt.jwtExpiration);
    const refreshToken = (0, jwtHelper_1.generateToken)({
        id: isExist.id,
        email: isExist.email,
        role: isExist.role,
    }, config_1.default.jwt.jwtRefreshSecret, config_1.default.jwt.jwtRefreshExpiration);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: isExist.needPasswordChange,
    };
});
const refreshUserToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let decode;
    try {
        decode = (0, jwtHelper_1.verifyToken)(payload, config_1.default.jwt.jwtRefreshSecret);
    }
    catch (error) {
        throw new Error("you  are not authorized to access this resource");
    }
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            email: decode.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isExist) {
        throw new Error("User not found");
    }
    const accessToken = (0, jwtHelper_1.generateToken)({
        id: isExist.id,
        email: isExist.email,
    }, config_1.default.jwt.jwtSecret, config_1.default.jwt.jwtExpiration);
    return {
        accessToken,
        needChangePassword: isExist.needPasswordChange,
    };
});
const passwordChange = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    if (!userData.id || !userData.email) {
        throw new ApiError_1.default(400, "User data is not provided");
    }
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            email: userData.email,
            id: userData.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isExist) {
        throw new Error("User not found");
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.oldPassword, isExist.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(400, "Creadentials are not valid");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield prisma_1.default.user.update({
        where: { id: isExist.id },
        data: { password: hashedPassword, needPasswordChange: false },
    });
    return { message: "Password changed successfully" };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email, status: client_1.UserStatus.ACTIVE },
    });
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    const resetToken = (0, jwtHelper_1.generateToken)({ id: user.id, email: user.email }, config_1.default.jwt.jwtSecret, "10m");
    const resetUrl = `${config_1.default.app.baseUrl}/reset-password?id=${user.id}&token=${resetToken}`;
    // Here you would typically send the reset token to the user's email
    // For example, using a mail service
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background: #fafbfc;">
      <h2 style="color: #2d8cff;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for your Medical Appointment account.</p>
      <p>
        Click the button below to reset your password. This link will expire in 10 minutes.
      </p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2d8cff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <hr style="margin: 32px 0;">
      <p style="font-size: 14px; color: #888;">Thank you,<br>Medical Appointment Team</p>
    </div>
  `;
    yield (0, emailSender_1.default)(email, emailHtml);
    return { resetUrl };
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findUnique({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isExist) {
        throw new Error("User not found");
    }
    const isValid = (0, jwtHelper_1.verifyToken)(token, config_1.default.jwt.jwtSecret);
    if (!isValid) {
        throw new ApiError_1.default(401, "Unauthorized");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password: hashedPassword,
        },
    });
});
exports.authService = {
    loginUser,
    refreshUserToken,
    passwordChange,
    forgetPassword,
    resetPassword,
};
