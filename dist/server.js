"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express2 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_cookie_parser = __toESM(require("cookie-parser"));

// src/app/errors/globalErrorHandler.ts
var import_client = require("@prisma/client/runtime/client");
var import_zod = require("zod");

// src/app/errors/ApiError.ts
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/app/errors/prismaErrorHandler.ts
var handlePrismaError = (err) => {
  switch (err.code) {
    case "P2000":
      const tooLongField = err.meta?.column_name || "field";
      return new AppError(`Value too long for field: ${tooLongField}.`, 400);
    case "P2001":
      return new AppError("The record you are searching for does not exist.", 404);
    case "P2002":
      const uniqueField = err.meta?.target?.join(", ") || "field";
      return new AppError(`Duplicate value for ${uniqueField}. Please use another value.`, 400);
    case "P2003":
      const fkField = err.meta?.field_name || "field";
      return new AppError(`Invalid reference on field: ${fkField}. The related record does not exist.`, 400);
    case "P2004":
      return new AppError("A database constraint failed. Please check your input.", 400);
    case "P2005":
      const invalidField = err.meta?.field_name || "field";
      return new AppError(`Invalid value stored in database for field: ${invalidField}.`, 400);
    case "P2006":
      const invalidValueField = err.meta?.field_name || "field";
      return new AppError(`Invalid value provided for field: ${invalidValueField}.`, 400);
    case "P2007":
      return new AppError("Data validation error. Please check your input.", 400);
    case "P2008":
      return new AppError("Failed to parse the query. Please check your request.", 400);
    case "P2009":
      return new AppError("Failed to validate the query. Please check your request.", 400);
    case "P2010":
      const rawQueryCode = err.meta?.code || "unknown";
      return new AppError(`Raw query failed with code: ${rawQueryCode}.`, 500);
    case "P2011":
      const nullField = err.meta?.constraint || "field";
      return new AppError(`Null constraint violation on field: ${nullField}. This field is required.`, 400);
    case "P2012":
      const missingField = err.meta?.path || "field";
      return new AppError(`Missing required value for: ${missingField}.`, 400);
    case "P2013":
      const missingArg = err.meta?.argument_name || "argument";
      return new AppError(`Missing required argument: ${missingArg}.`, 400);
    case "P2014":
      const relationName = err.meta?.relation_name || "unknown";
      return new AppError(`The change would violate a required relation: ${relationName}.`, 400);
    case "P2015":
      return new AppError("A related record could not be found.", 404);
    case "P2016":
      return new AppError("Query interpretation error. Please check your request.", 400);
    case "P2017":
      const p2017Relation = err.meta?.relation_name || "unknown";
      return new AppError(`Records for relation '${p2017Relation}' are not connected.`, 400);
    case "P2018":
      return new AppError("Required connected records were not found.", 404);
    case "P2019":
      return new AppError("Input error. Please check the data you provided.", 400);
    case "P2020":
      const outOfRangeField = err.meta?.field_name || "field";
      return new AppError(`Value out of range for field: ${outOfRangeField}.`, 400);
    case "P2021":
      const tableName = err.meta?.table || "unknown";
      return new AppError(`Table '${tableName}' does not exist in the database.`, 500);
    case "P2022":
      const columnName = err.meta?.column || "unknown";
      return new AppError(`Column '${columnName}' does not exist in the database.`, 500);
    case "P2023":
      return new AppError("Inconsistent column data. Please check your database schema.", 500);
    case "P2024":
      return new AppError("Database connection timed out. Please try again later.", 503);
    case "P2025":
      const cause = err.meta?.cause || "The requested record was not found.";
      return new AppError(cause, 404);
    case "P2026":
      return new AppError("This operation is not supported by the current database provider.", 400);
    case "P2027":
      return new AppError("Multiple errors occurred during the database transaction.", 500);
    case "P2028":
      return new AppError("Transaction API error. Please try again.", 500);
    case "P2029":
      return new AppError("Query parameter limit exceeded. Please reduce the number of parameters.", 400);
    case "P2030":
      return new AppError("Fulltext index not found. Cannot perform fulltext search.", 400);
    case "P2031":
      return new AppError("MongoDB replica set is required for transactions.", 500);
    case "P2033":
      return new AppError("A number used in the query does not fit into a 64-bit integer.", 400);
    case "P2034":
      return new AppError("Transaction failed due to a write conflict or deadlock. Please retry.", 409);
    case "P2035":
      return new AppError("Assertion violation on the database.", 500);
    case "P2036":
      return new AppError("Error in external connector. Please check your configuration.", 500);
    case "P2037":
      return new AppError("Too many database connections open. Please try again later.", 503);
    // ─── Default ─────────────────────────────────────────────────────────────────
    default:
      return new AppError(`Database error [${err.code}]: ${err.message}`, 500);
  }
};

// src/app/errors/handleZodError.ts
var handleZodError = (err) => {
  const message = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
  return new AppError(message, 400);
};

// src/app/errors/handleSyntaxError.ts
var handleSyntaxError = () => new AppError("Invalid JSON in request body. Please check your request format.", 400);

// src/app/errors/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err instanceof import_client.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof import_zod.ZodError) {
    error = handleZodError(err);
  } else if (err instanceof SyntaxError && "body" in err) {
    error = handleSyntaxError();
  }
  const statusCode = error.statusCode || 500;
  const status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  res.status(statusCode).json({
    status,
    message: error.message || "Internal Server Error",
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
};

// src/app/routes/index.ts
var import_express = require("express");
var router = (0, import_express.Router)();
var moduleRoutes = [
  // {
  //     path: "/user",
  //     route: UserRoute
  // }
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// src/app.ts
var app = (0, import_express2.default)();
app.use(
  (0, import_cors.default)({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"] : ["http://localhost:3000", "http://localhost:5173", "http://192.168.0.127:3000"],
    credentials: true
  })
);
app.use(import_express2.default.json());
app.use(import_express2.default.urlencoded({ extended: true }));
app.use((0, import_cookie_parser.default)());
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`\u{1F680} [${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    version: "1.0.0"
  });
});
app.use("/api/v1", router);
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
var app_default = app;

// src/app/config/index.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
import_dotenv.default.config({ path: import_path.default.join(process.cwd(), ".env") });
var str = (key, defaultVal) => ({ key, type: "string", default: defaultVal, required: defaultVal === void 0 });
var num = (key, defaultVal) => ({ key, type: "number", default: defaultVal, required: defaultVal === void 0 });
var bool = (key, defaultVal) => ({ key, type: "boolean", default: defaultVal, required: defaultVal === void 0 });
var resolve = (field) => {
  const raw = process.env[field.key];
  if (raw === void 0 || raw === "") {
    if (field.required) throw new Error(`[Config] Missing required env variable: "${field.key}"`);
    return field.default;
  }
  if (field.type === "number") {
    const parsed = Number(raw);
    if (isNaN(parsed)) throw new Error(`[Config] Invalid number for env variable: "${field.key}" (got "${raw}")`);
    return parsed;
  }
  if (field.type === "boolean") {
    if (!["true", "false", "1", "0"].includes(raw.toLowerCase())) {
      throw new Error(`[Config] Invalid boolean for env variable: "${field.key}" (got "${raw}")`);
    }
    return raw.toLowerCase() === "true" || raw === "1";
  }
  return raw;
};
var buildConfig = (schema) => {
  const config2 = {};
  for (const group in schema) {
    config2[group] = {};
    for (const field in schema[group]) {
      config2[group][field] = resolve(schema[group][field]);
    }
  }
  return config2;
};
var config = buildConfig({
  app: {
    port: num("PORT", 3e3),
    env: str("NODE_ENV", "development"),
    enableSwagger: bool("ENABLE_SWAGGER", false)
  },
  db: {
    url: str("DATABASE_URL")
  }
  //   jwt: {
  //     secret:           str("JWT_SECRET"),
  //     expiresIn:        str("JWT_EXPIRES_IN",         "7d"),
  //     refreshSecret:    str("JWT_REFRESH_SECRET"),
  //     refreshExpiresIn: str("JWT_REFRESH_EXPIRES_IN", "30d"),
  //   },
  //   bcrypt: {
  //     saltRounds: num("BCRYPT_SALT_ROUNDS", 10),
  //   },
  //   email: {
  //     host: str("SMTP_HOST"),
  //     port: num("SMTP_PORT", 587),
  //     user: str("SMTP_USER"),
  //     pass: str("SMTP_PASS"),
  //     from: str("SMTP_FROM", "noreply@app.com"),
  //   },
  //   cloudinary: {
  //     cloudName: str("CLOUDINARY_CLOUD_NAME"),
  //     apiKey:    str("CLOUDINARY_API_KEY"),
  //     apiSecret: str("CLOUDINARY_API_SECRET"),
  //   },
});

// src/server.ts
var PORT = process.env.PORT || 5e3;
var server;
async function bootstrap() {
  try {
    server = app_default.listen(config.app.port, () => {
      console.log(`\u{1F680} Server is humming along on http://localhost:${config.app.port}`);
    });
  } catch (error) {
    console.error("\u274C Failed to start server:", error);
    process.exit(1);
  }
}
var shutdown = (signal, error) => {
  console.log(`
--- ${signal} received ---`);
  if (error) console.error("Error details:", error);
  if (server) {
    console.log("\u{1F6D1} Closing HTTP server...");
    server.close(() => {
      console.log("\u2705 HTTP server closed. Process exiting.");
      process.exit(error ? 1 : 0);
    });
  } else {
    process.exit(error ? 1 : 0);
  }
};
process.on("uncaughtException", (err) => {
  shutdown("UNCAUGHT EXCEPTION", err);
});
process.on("unhandledRejection", (err) => {
  shutdown("UNHANDLED REJECTION", err);
});
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
bootstrap();
//# sourceMappingURL=server.js.map