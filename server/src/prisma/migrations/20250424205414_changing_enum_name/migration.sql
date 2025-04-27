/*
  Warnings:

  - The `status` column on the `Issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `issue_type` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `urgency` on the `Issue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IssueStatusEnum" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IssueTypeEnum" AS ENUM ('OBSTRUCTION', 'EROSION', 'FLOODING', 'SIGNAGE', 'VANDALISM', 'OTHER');

-- CreateEnum
CREATE TYPE "IssueUrgencyEnum" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "UserRoleEnum" AS ENUM ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN');

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "status",
ADD COLUMN     "status" "IssueStatusEnum" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "issue_type",
ADD COLUMN     "issue_type" "IssueTypeEnum" NOT NULL,
DROP COLUMN "urgency",
ADD COLUMN     "urgency" "IssueUrgencyEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Park" RENAME CONSTRAINT "Parks_pkey" TO "Park_pkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoleEnum" NOT NULL DEFAULT 'ROLE_USER';

-- DropEnum
DROP TYPE "IssueStatus";

-- DropEnum
DROP TYPE "IssueType";

-- DropEnum
DROP TYPE "Urgency";

-- DropEnum
DROP TYPE "UserRole";
