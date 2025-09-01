-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "note" TEXT NOT NULL
);
