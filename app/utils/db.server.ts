import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "~/generated/client";

import { singleton } from "./singleton.server";

// Hard-code a unique key, so we can look up the client when this module gets re-imported
export const db = singleton("prisma", () => {
  const adapter = new PrismaBetterSqlite3({ url: process.env["DATABASE_URL"] });
  return new PrismaClient({ adapter });
});
