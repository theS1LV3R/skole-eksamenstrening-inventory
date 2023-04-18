/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password_hash` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `UserRole` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "name" SET NOT NULL;
