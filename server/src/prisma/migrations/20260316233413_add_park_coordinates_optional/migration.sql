/*
  Warnings:

  - You are about to drop the column `longitude` on the `Park` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Park" DROP COLUMN "longitude",
ADD COLUMN     "maxLatitude" DOUBLE PRECISION,
ADD COLUMN     "maxLongitude" DOUBLE PRECISION,
ADD COLUMN     "minLatitude" DOUBLE PRECISION,
ADD COLUMN     "minLongitude" DOUBLE PRECISION;
