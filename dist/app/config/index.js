"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const str = (key, defaultVal) => ({ key, type: "string", default: defaultVal, required: defaultVal === undefined });
const num = (key, defaultVal) => ({ key, type: "number", default: defaultVal, required: defaultVal === undefined });
const bool = (key, defaultVal) => ({ key, type: "boolean", default: defaultVal, required: defaultVal === undefined });
const resolve = (field) => {
    const raw = process.env[field.key];
    // missing
    if (raw === undefined || raw === "") {
        if (field.required)
            throw new Error(`[Config] Missing required env variable: "${field.key}"`);
        return field.default;
    }
    // parse by type
    if (field.type === "number") {
        const parsed = Number(raw);
        if (isNaN(parsed))
            throw new Error(`[Config] Invalid number for env variable: "${field.key}" (got "${raw}")`);
        return parsed;
    }
    if (field.type === "boolean") {
        if (!["true", "false", "1", "0"].includes(raw.toLowerCase())) {
            throw new Error(`[Config] Invalid boolean for env variable: "${field.key}" (got "${raw}")`);
        }
        return (raw.toLowerCase() === "true" || raw === "1");
    }
    return raw;
};
const buildConfig = (schema) => {
    const config = {};
    for (const group in schema) {
        config[group] = {};
        for (const field in schema[group]) {
            config[group][field] = resolve(schema[group][field]);
        }
    }
    return config;
};
exports.config = buildConfig({
    app: {
        port: num("PORT", 3000),
        env: str("NODE_ENV", "development"),
        enableSwagger: bool("ENABLE_SWAGGER", false),
    },
    db: {
        url: str("DATABASE_URL"),
    },
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
    cloudinary: {
        cloudName: str("CLOUDINARY_CLOUD_NAME"),
        apiKey: str("CLOUDINARY_API_KEY"),
        apiSecret: str("CLOUDINARY_API_SECRET"),
    },
});
