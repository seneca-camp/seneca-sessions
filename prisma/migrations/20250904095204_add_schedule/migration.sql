/*
  Warnings:

  - You are about to drop the column `day` on the `Session` table. All the data in the column will be lost.
  - Added the required column `scheduleId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    CONSTRAINT "Session_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "note", "room", "slot", "title") SELECT "id", "note", "room", "slot", "title" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
