/*
  Warnings:

  - Made the column `created_at` on table `parks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `parks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "parks" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL;
