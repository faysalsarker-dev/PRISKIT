"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const extension_1 = require("@prisma/client/extension");
require("dotenv/config");
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new extension_1.PrismaClient({ adapter });
exports.default = prisma;
