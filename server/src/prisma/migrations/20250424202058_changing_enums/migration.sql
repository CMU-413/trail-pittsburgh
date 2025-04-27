/*
  Warnings:

  - The values [MEDIUM_LOW,MEDIUM_HIGH] on the enum `Urgency` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `name` on the `Park` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(50)`.
  - You are about to alter the column `county` on the `Park` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Trail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(100)`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Urgency_new" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');
ALTER TABLE "Issue" ALTER COLUMN "urgency" DROP DEFAULT;
ALTER TABLE "Issue" ALTER COLUMN "urgency" TYPE "Urgency_new" USING ("urgency"::text::"Urgency_new");
ALTER TYPE "Urgency" RENAME TO "Urgency_old";
ALTER TYPE "Urgency_new" RENAME TO "Urgency";
DROP TYPE "Urgency_old";
COMMIT;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "description" SET DATA TYPE VARCHAR(450),
ALTER COLUMN "urgency" DROP DEFAULT,
ALTER COLUMN "notify_reporter" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Park" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "county" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Trail" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "is_open" SET DEFAULT true;
