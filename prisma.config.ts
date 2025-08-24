// prisma.config.ts

import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// load .env secara manual
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
