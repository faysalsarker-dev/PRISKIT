"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = void 0;
const ApiError_1 = require("./ApiError");
const handlePrismaError = (err) => {
    switch (err.code) {
        case "P2000":
            const tooLongField = err.meta?.column_name || "field";
            return new ApiError_1.AppError(`Value too long for field: ${tooLongField}.`, 400);
        case "P2001":
            return new ApiError_1.AppError("The record you are searching for does not exist.", 404);
        case "P2002":
            const uniqueField = err.meta?.target?.join(", ") || "field";
            return new ApiError_1.AppError(`Duplicate value for ${uniqueField}. Please use another value.`, 400);
        case "P2003":
            const fkField = err.meta?.field_name || "field";
            return new ApiError_1.AppError(`Invalid reference on field: ${fkField}. The related record does not exist.`, 400);
        case "P2004":
            return new ApiError_1.AppError("A database constraint failed. Please check your input.", 400);
        case "P2005":
            // Invalid value for field type stored in database
            const invalidField = err.meta?.field_name || "field";
            return new ApiError_1.AppError(`Invalid value stored in database for field: ${invalidField}.`, 400);
        case "P2006":
            // Invalid value provided for field
            const invalidValueField = err.meta?.field_name || "field";
            return new ApiError_1.AppError(`Invalid value provided for field: ${invalidValueField}.`, 400);
        case "P2007":
            // Data validation error
            return new ApiError_1.AppError("Data validation error. Please check your input.", 400);
        case "P2008":
            // Failed to parse query
            return new ApiError_1.AppError("Failed to parse the query. Please check your request.", 400);
        case "P2009":
            // Failed to validate query
            return new ApiError_1.AppError("Failed to validate the query. Please check your request.", 400);
        case "P2010":
            // Raw query failed
            const rawQueryCode = err.meta?.code || "unknown";
            return new ApiError_1.AppError(`Raw query failed with code: ${rawQueryCode}.`, 500);
        case "P2011":
            // Null constraint violation
            const nullField = err.meta?.constraint || "field";
            return new ApiError_1.AppError(`Null constraint violation on field: ${nullField}. This field is required.`, 400);
        case "P2012":
            // Missing required value
            const missingField = err.meta?.path || "field";
            return new ApiError_1.AppError(`Missing required value for: ${missingField}.`, 400);
        case "P2013":
            // Missing required argument
            const missingArg = err.meta?.argument_name || "argument";
            return new ApiError_1.AppError(`Missing required argument: ${missingArg}.`, 400);
        case "P2014":
            // Relation violation (required relation would be violated)
            const relationName = err.meta?.relation_name || "unknown";
            return new ApiError_1.AppError(`The change would violate a required relation: ${relationName}.`, 400);
        case "P2015":
            // Related record not found
            return new ApiError_1.AppError("A related record could not be found.", 404);
        case "P2016":
            // Query interpretation error
            return new ApiError_1.AppError("Query interpretation error. Please check your request.", 400);
        case "P2017":
            // Records not connected for relation
            const p2017Relation = err.meta?.relation_name || "unknown";
            return new ApiError_1.AppError(`Records for relation '${p2017Relation}' are not connected.`, 400);
        case "P2018":
            // Required connected records not found
            return new ApiError_1.AppError("Required connected records were not found.", 404);
        case "P2019":
            // Input error
            return new ApiError_1.AppError("Input error. Please check the data you provided.", 400);
        case "P2020":
            // Value out of range
            const outOfRangeField = err.meta?.field_name || "field";
            return new ApiError_1.AppError(`Value out of range for field: ${outOfRangeField}.`, 400);
        case "P2021":
            // Table does not exist
            const tableName = err.meta?.table || "unknown";
            return new ApiError_1.AppError(`Table '${tableName}' does not exist in the database.`, 500);
        case "P2022":
            // Column does not exist
            const columnName = err.meta?.column || "unknown";
            return new ApiError_1.AppError(`Column '${columnName}' does not exist in the database.`, 500);
        case "P2023":
            // Inconsistent column data
            return new ApiError_1.AppError("Inconsistent column data. Please check your database schema.", 500);
        case "P2024":
            // Timed out fetching connection from pool
            return new ApiError_1.AppError("Database connection timed out. Please try again later.", 503);
        case "P2025":
            // Record not found
            const cause = err.meta?.cause || "The requested record was not found.";
            return new ApiError_1.AppError(cause, 404);
        case "P2026":
            // Unsupported feature by current database provider
            return new ApiError_1.AppError("This operation is not supported by the current database provider.", 400);
        case "P2027":
            // Multiple errors during transaction
            return new ApiError_1.AppError("Multiple errors occurred during the database transaction.", 500);
        case "P2028":
            // Transaction API error
            return new ApiError_1.AppError("Transaction API error. Please try again.", 500);
        case "P2029":
            // Query parameter limit exceeded
            return new ApiError_1.AppError("Query parameter limit exceeded. Please reduce the number of parameters.", 400);
        case "P2030":
            // Fulltext index not found
            return new ApiError_1.AppError("Fulltext index not found. Cannot perform fulltext search.", 400);
        case "P2031":
            // MongoDB replica set required
            return new ApiError_1.AppError("MongoDB replica set is required for transactions.", 500);
        case "P2033":
            // Number out of range for 64-bit integer
            return new ApiError_1.AppError("A number used in the query does not fit into a 64-bit integer.", 400);
        case "P2034":
            // Transaction conflict (write conflict or deadlock)
            return new ApiError_1.AppError("Transaction failed due to a write conflict or deadlock. Please retry.", 409);
        case "P2035":
            // Assertion violation on the database
            return new ApiError_1.AppError("Assertion violation on the database.", 500);
        case "P2036":
            // External connector error
            return new ApiError_1.AppError("Error in external connector. Please check your configuration.", 500);
        case "P2037":
            // Too many connections
            return new ApiError_1.AppError("Too many database connections open. Please try again later.", 503);
        // ─── Default ─────────────────────────────────────────────────────────────────
        default:
            return new ApiError_1.AppError(`Database error [${err.code}]: ${err.message}`, 500);
    }
};
exports.handlePrismaError = handlePrismaError;
