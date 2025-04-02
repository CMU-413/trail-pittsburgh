/*
  Warnings:

  - Added the required column `county` to the `parks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parks" ADD COLUMN     "county" TEXT NOT NULL,
ADD COLUMN     "owner_id" INTEGER;
