"use strict";
// ─── Types ────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.countRecords = exports.exists = exports.deleteMany = exports.updateMany = exports.createMany = exports.deleteOne = exports.updateOne = exports.getOne = exports.getById = exports.getAll = exports.createOne = void 0;
const ApiError_1 = require("../errors/ApiError");
const QueryBuilder_1 = require("../utils/QueryBuilder");
// ─── Functions ────────────────────────────────────────────────────────────────
const createOne = async (model, data, include) => {
    return model.create({ data, ...(include && { include }) });
};
exports.createOne = createOne;
// ─────────────────────────────────────────────────────────────────────────────
const getAll = async (model, query = {}, searchableFields = [], include) => {
    const { where, orderBy, skip, take, page } = (0, QueryBuilder_1.buildPrismaQuery)(query, searchableFields);
    const [data, total] = await Promise.all([
        model.findMany({ where, orderBy, skip, take, ...(include && { include }) }),
        model.count({ where }),
    ]);
    const totalPages = Math.ceil(total / take);
    return {
        data,
        meta: {
            total,
            page,
            limit: take,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};
exports.getAll = getAll;
// ─────────────────────────────────────────────────────────────────────────────
const getById = async (model, id, include) => {
    const record = await model.findUnique({
        where: { id },
        ...(include && { include }),
    });
    if (!record)
        throw new ApiError_1.AppError("Record not found.", 404);
    return record;
};
exports.getById = getById;
// ─────────────────────────────────────────────────────────────────────────────
const getOne = async (model, where, include) => {
    return model.findFirst({ where, ...(include && { include }) });
};
exports.getOne = getOne;
// ─────────────────────────────────────────────────────────────────────────────
const updateOne = async (model, id, data, include) => {
    await (0, exports.getById)(model, id); // ensure exists
    return model.update({
        where: { id },
        data,
        ...(include && { include }),
    });
};
exports.updateOne = updateOne;
// ─────────────────────────────────────────────────────────────────────────────
const deleteOne = async (model, id, include) => {
    await (0, exports.getById)(model, id); // ensure exists
    return model.delete({
        where: { id },
        ...(include && { include }),
    });
};
exports.deleteOne = deleteOne;
// ─────────────────────────────────────────────────────────────────────────────
const createMany = async (model, data) => {
    return model.createMany({ data });
};
exports.createMany = createMany;
// ─────────────────────────────────────────────────────────────────────────────
const updateMany = async (model, where, data) => {
    return model.updateMany({ where, data });
};
exports.updateMany = updateMany;
// ─────────────────────────────────────────────────────────────────────────────
const deleteMany = async (model, where) => {
    return model.deleteMany({ where });
};
exports.deleteMany = deleteMany;
// ─────────────────────────────────────────────────────────────────────────────
const exists = async (model, where) => {
    const count = await model.count({ where });
    return count > 0;
};
exports.exists = exists;
// ─────────────────────────────────────────────────────────────────────────────
const countRecords = async (model, where = {}) => {
    return model.count({ where });
};
exports.countRecords = countRecords;
