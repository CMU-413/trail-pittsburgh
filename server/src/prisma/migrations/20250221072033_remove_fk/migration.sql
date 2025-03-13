/*
  Warnings:

  - You are about to drop the `Parks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trails" DROP CONSTRAINT "trails_created_by_fkey";

-- DropTable
DROP TABLE "Parks";

-- CreateTable
CREATE TABLE "parks" (
    "park_id" SERIAL NOT NULL,
    "park_name" VARCHAR(150) NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("park_id")
);
