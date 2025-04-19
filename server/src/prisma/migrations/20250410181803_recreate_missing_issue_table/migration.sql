-- CreateTable
CREATE TABLE "Park" (
    "parkId" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "county" VARCHAR(150) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("parkId")
);

-- CreateTable
CREATE TABLE "Trail" (
    "trailId" SERIAL NOT NULL,
    "parkId" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOpen" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("trailId")
);

-- CreateTable
CREATE TABLE "Issue" (
    "issueId" SERIAL NOT NULL,
    "parkId" INTEGER NOT NULL,
    "trailId" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "description" VARCHAR(150),
    "issueType" VARCHAR(150) NOT NULL,
    "urgency" INTEGER NOT NULL,
    "issueImage" VARCHAR(150),
    "notifyReporter" BOOLEAN NOT NULL,
    "reporterEmail" VARCHAR(150) NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("issueId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "permission" TEXT NOT NULL,
    "profileImage" VARCHAR NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "content" VARCHAR(150) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Trail" ADD CONSTRAINT "Trail_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "Park"("parkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "Park"("parkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("trailId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("issueId") ON DELETE RESTRICT ON UPDATE CASCADE;
