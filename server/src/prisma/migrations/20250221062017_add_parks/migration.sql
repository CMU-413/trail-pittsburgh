-- CreateTable
CREATE TABLE "Parks" (
    "park_id" SERIAL NOT NULL,
    "park_name" VARCHAR(150) NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parks_pkey" PRIMARY KEY ("park_id")
);
