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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const client_1 = require("@prisma/client");
const admin_constant_1 = require("./admin.constant");
const pagination_1 = require("../../helper/pagination");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Get all admins with pagination, sorting, and filtering
const AllAdminGet = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const { page, limit, sortBy, sortOrder, skip } = pagination_1.paginationHelper.calculatePagination(options);
    const addCondition = [];
    if (searchTerm) {
        addCondition.push({
            OR: admin_constant_1.adminSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        addCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                    mode: "insensitive",
                },
            })),
        });
    }
    addCondition.push({
        isDeleted: false, // Ensure we only get non-deleted admins
    });
    const whereCondition = {
        AND: addCondition,
    };
    const result = yield prisma_1.default.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.admin.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
        data: result,
    };
});
//get single admin by id
const getSingleAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false, // Ensure we only get non-deleted admins
        },
    });
    if (!result) {
        throw new Error("Admin not found");
    }
    return result;
});
// single admin update
const updateSingleAdmin = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false, // Ensure we only update non-deleted admins
        },
    });
    if (!isExist) {
        throw new Error("Admin not found");
    }
    const result = yield prisma_1.default.admin.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
//Delete single admin
const deleteSingleAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false, // Ensure we only delete non-deleted admins
        },
    });
    if (!isExist) {
        throw new Error("Admin not found");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdmin = yield tx.admin.delete({
            where: {
                id,
            },
        });
        yield tx.user.delete({
            where: {
                email: deletedAdmin.email,
            },
        });
        return deletedAdmin;
    }));
    return result;
});
//Delete single admin
const softDeleteSingleAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.admin.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new Error("Admin not found");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdmin = yield tx.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
            },
        });
        yield tx.user.update({
            where: {
                email: deletedAdmin.email,
            },
            data: {
                status: client_1.UserStatus.DELETED,
            },
        });
        return deletedAdmin;
    }));
    return result;
});
exports.adminService = {
    AllAdminGet,
    getSingleAdmin,
    updateSingleAdmin,
    deleteSingleAdmin,
    softDeleteSingleAdmin,
};
