/*
  Warnings:

  - Added the required column `safetyRisk` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IssueRiskEnum" AS ENUM ('NO_RISK', 'MINOR_RISK', 'SERIOUS_RISK');

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "safetyRisk" "IssueRiskEnum" NOT NULL;
