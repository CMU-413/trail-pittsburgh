-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('OBSTRUCTION', 'EROSION', 'FLOODING', 'SIGNAGE', 'VANDALISM', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM_LOW', 'MEDIUM', 'MEDIUM_HIGH', 'HIGH');

-- CreateTable
CREATE TABLE "Park" (
    "park_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "county" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("park_id")
);

-- CreateTable
CREATE TABLE "Trail" (
    "trail_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_open" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("trail_id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "issue_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "description" VARCHAR(150),
    "issue_type" "IssueType" NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'MEDIUM',
    "issue_image" VARCHAR(150),
    "notify_reporter" BOOLEAN NOT NULL,
    "reporter_email" VARCHAR(150) NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ROLE_USER',
    "profile_image" VARCHAR NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "recipient_email" TEXT NOT NULL,
    "content" VARCHAR(150) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Park"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Park"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("trail_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "Issue"("issue_id") ON DELETE RESTRICT ON UPDATE CASCADE;
