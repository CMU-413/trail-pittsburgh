/*
  Warnings:

  - You are about to drop the column `create_at` on the `parks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parks" DROP COLUMN "create_at",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
