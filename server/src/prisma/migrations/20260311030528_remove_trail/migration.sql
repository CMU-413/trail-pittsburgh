/*
  Warnings:

  - You are about to drop the column `trail_id` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the `Trail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_trail_id_fkey";

-- DropForeignKey
ALTER TABLE "Trail" DROP CONSTRAINT "Trail_park_id_fkey";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "trail_id";

-- DropTable
DROP TABLE "Trail";
