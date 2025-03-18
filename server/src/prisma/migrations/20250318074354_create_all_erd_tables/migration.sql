/*
  Warnings:

  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_active` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_admin` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_hubspot_user` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "username",
ADD COLUMN     "is_active" BOOLEAN NOT NULL,
ADD COLUMN     "is_admin" BOOLEAN NOT NULL,
ADD COLUMN     "is_hubspot_user" BOOLEAN NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "picture" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "Permissions" (
    "permission_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resource_type" VARCHAR(150) NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "permission_type" VARCHAR(150) NOT NULL,
    "assigned_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "Issues" (
    "issue_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "status" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "issue_type" VARCHAR(150) NOT NULL,
    "urgency" INTEGER NOT NULL,
    "issue_image" VARCHAR(150) NOT NULL,
    "notify_reporter" BOOLEAN NOT NULL,
    "resolved_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "notification_id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "content" VARCHAR(150) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Anonymous_users" (
    "email" TEXT NOT NULL,
    "status" VARCHAR(150) NOT NULL,

    CONSTRAINT "Anonymous_users_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anonymous_users_email_key" ON "Anonymous_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Parks"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Parks"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issues" ADD CONSTRAINT "Issues_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trails"("trail_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
