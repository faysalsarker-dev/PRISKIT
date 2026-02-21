"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./app/config");
const PORT = process.env.PORT || 5000;
let server;
async function bootstrap() {
    try {
        server = app_1.default.listen(config_1.config.app.port, () => {
            console.log(`🚀 Server is humming along on http://localhost:${config_1.config.app.port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
// Helper for Graceful Shutdown
const shutdown = (signal, error) => {
    console.log(`\n--- ${signal} received ---`);
    if (error)
        console.error("Error details:", error);
    if (server) {
        console.log("🛑 Closing HTTP server...");
        server.close(() => {
            console.log("✅ HTTP server closed. Process exiting.");
            process.exit(error ? 1 : 0);
        });
    }
    else {
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
