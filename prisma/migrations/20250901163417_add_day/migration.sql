-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "day" TEXT NOT NULL DEFAULT 'SATURDAY'
);
INSERT INTO "new_Session" ("id", "note", "room", "slot", "title") SELECT "id", "note", "room", "slot", "title" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
