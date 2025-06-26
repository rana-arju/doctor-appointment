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
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const pick_1 = require("../../../shared/pick");
const admin_constant_1 = require("./admin.constant");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const getAllAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, pick_1.pick)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield admin_service_1.adminService.AllAdminGet(query, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admins fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleAdminFromDB = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield admin_service_1.adminService.getSingleAdmin(id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Admins fetched successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateSingleAdminFromDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield admin_service_1.adminService.updateSingleAdmin(id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin updated successfully",
        data: result,
    });
}));
const deleteSingleAdminFromDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.deleteSingleAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
}));
const softDeleteSingleAdminFromDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.softDeleteSingleAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admins fetched successfully",
        data: result,
    });
}));
exports.adminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateSingleAdminFromDB,
    deleteSingleAdminFromDB,
    softDeleteSingleAdminFromDB,
};
