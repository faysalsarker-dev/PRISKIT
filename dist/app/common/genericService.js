"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFromDB = void 0;
const QueryBuilder_1 = require("../utils/QueryBuilder");
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllFromDB = async (modelName, query, searchableFields = []) => {
    const { where, orderBy, skip, take, page } = (0, QueryBuilder_1.buildPrismaQuery)(query, searchableFields);
    // Execute both queries in parallel for performance
    const [data, total] = await Promise.all([
        prisma_1.default[modelName].findMany({ where, orderBy, skip, take }),
        prisma_1.default[modelName].count({ where }),
    ]);
    return {
        meta: {
            page,
            limit: take,
            total,
            totalPage: Math.ceil(total / take),
        },
        data,
    };
};
exports.getAllFromDB = getAllFromDB;
