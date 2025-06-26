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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
// Create a test account or replace with real credentials.
const emailSender = (email, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.default.email.smtpHost, // e.g., smtp.ethereal.email
        port: config_1.default.email.smtpPort, // 587 for TLS, 465 for SSL
        secure: false, // true for 465, false for other ports
        auth: {
            user: config_1.default.email.smtpUser,
            pass: config_1.default.email.smtpPassword, // generated ethereal password
        },
    });
    const info = yield transporter.sendMail({
        from: '"Medical Appointement" <arjurana20@gmail.com>',
        to: email, // list of receivers
        subject: "Reset password link", // Subject line
        //text: "", // plain‑text body
        html,
    });
});
exports.default = emailSender;
