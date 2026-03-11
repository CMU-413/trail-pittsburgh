/*
  Warnings:

  - You are about to drop the column `urgency` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "urgency";

-- DropEnum
DROP TYPE "IssueUrgencyEnum";
