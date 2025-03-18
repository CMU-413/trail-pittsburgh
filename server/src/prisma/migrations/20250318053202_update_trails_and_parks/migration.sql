/*
  Warnings:

  - You are about to drop the `parks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "parks";

-- DropTable
DROP TABLE "trails";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Trails" (
    "trail_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_open" BOOLEAN NOT NULL,

    CONSTRAINT "Trails_pkey" PRIMARY KEY ("trail_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Parks" (
    "park_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "county" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("park_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Trails" ADD CONSTRAINT "Trails_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Parks"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;
