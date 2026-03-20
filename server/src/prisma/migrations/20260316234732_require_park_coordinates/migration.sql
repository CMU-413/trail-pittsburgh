/*
  Warnings:

  - Made the column `maxLatitude` on table `Park` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxLongitude` on table `Park` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minLatitude` on table `Park` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minLongitude` on table `Park` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Park" ALTER COLUMN "maxLatitude" SET NOT NULL,
ALTER COLUMN "maxLongitude" SET NOT NULL,
ALTER COLUMN "minLatitude" SET NOT NULL,
ALTER COLUMN "minLongitude" SET NOT NULL;
