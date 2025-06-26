"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelper_1 = require("../app/helper/jwtHelper");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../app/errors/ApiError"));
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError_1.default(401, "Unauthorized: No token provided");
            }
            const verify = (0, jwtHelper_1.verifyToken)(token, config_1.default.jwt.jwtSecret);
            if (!verify || !roles.includes(verify.role)) {
                throw new ApiError_1.default(403, "Forbidden: You do not have permission to access this resource");
            }
            req.user = verify;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = auth;
