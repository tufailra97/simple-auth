/*
 Warnings:
 
 - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
 - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
 - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
 - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
 - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
 - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
 - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateTable
CREATE TABLE "user_verification_tokens" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "valid_until" DATETIME NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "is_valid" BOOLEAN NOT NULL DEFAULT true,
  "user_id" TEXT NOT NULL,
  CONSTRAINT "user_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys = ON;

PRAGMA foreign_keys = OFF;

CREATE TABLE "new_users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "is_verified" BOOLEAN NOT NULL DEFAULT false,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL
);

INSERT INTO
  "new_users" ("email", "id", "password")
SELECT
  "email",
  "id",
  "password"
FROM
  "users";

DROP TABLE "users";

ALTER TABLE
  "new_users" RENAME TO "users";

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

PRAGMA foreign_keys = ON;

PRAGMA defer_foreign_keys = OFF;