/*
 Warnings:
 
 - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropTable
PRAGMA foreign_keys = off;

DROP TABLE "User";

PRAGMA foreign_keys = on;

-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "password" TEXT NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");