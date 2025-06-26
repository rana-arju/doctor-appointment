"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT || 5000,
    jwt: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRATION || "3d",
        jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET,
        jwtRefreshExpiration: process.env.REFRESH_TOKEN_EXPIRATION || "365d",
    },
    app: {
        baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
    email: {
        smtpHost: process.env.EMAIL_HOST,
        smtpPort: process.env.EMAIL_PORT,
        smtpUser: process.env.EMAIL_USER,
        smtpPassword: process.env.EMAIL_PASSWORD,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};
