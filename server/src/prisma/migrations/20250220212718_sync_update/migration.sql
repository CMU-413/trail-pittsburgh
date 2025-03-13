-- CreateTable
CREATE TABLE "trails" (
    "trail_id" SERIAL NOT NULL,
    "trail_name" VARCHAR(150) NOT NULL,
    "location" VARCHAR(200),
    "created_by" INTEGER,

    CONSTRAINT "trails_pkey" PRIMARY KEY ("trail_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "trails" ADD CONSTRAINT "trails_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
