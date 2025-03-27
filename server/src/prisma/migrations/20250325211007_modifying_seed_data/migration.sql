-- CreateTable
CREATE TABLE "issues" (
    "id" SERIAL NOT NULL,
    "park_id" INTEGER NOT NULL,
    "trail_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "urgency" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_park_id_fkey" FOREIGN KEY ("park_id") REFERENCES "parks"("park_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("trail_id") ON DELETE CASCADE ON UPDATE CASCADE;
