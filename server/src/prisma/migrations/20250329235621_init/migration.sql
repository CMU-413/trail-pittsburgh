-- CreateTable
CREATE TABLE "Trail" (
    "trail_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_open" BOOLEAN NOT NULL,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("trail_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "is_admin" BOOLEAN NOT NULL,
    "is_hubspot_user" BOOLEAN NOT NULL,
    "profile_image_key" VARCHAR NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resource_type" VARCHAR(150) NOT NULL,
    "resource_id" INTEGER NOT NULL,
    "permission_type" VARCHAR(150) NOT NULL,
    "assigned_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "Park" (
    "park_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "county" VARCHAR(150) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("park_id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "issue_id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "status" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "issue_type" VARCHAR(150) NOT NULL,
    "urgency" INTEGER NOT NULL,
    "issue_image" VARCHAR(150),
    "notify_reporter" BOOLEAN NOT NULL,
    "resolved_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "content" VARCHAR(150) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Anonymous_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "status" VARCHAR(150) NOT NULL,

    CONSTRAINT "Anonymous_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Anonymous_user_email_key" ON "Anonymous_user"("email");

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Park"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Park"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "Park"("park_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "Trail"("trail_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
