-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "issue_group_id" INTEGER;

-- CreateTable
CREATE TABLE "IssueGroup" (
    "issue_group_id" SERIAL NOT NULL,
    "primary_issue_id" INTEGER,
    "status" "IssueStatusEnum" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueGroup_pkey" PRIMARY KEY ("issue_group_id")
);

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_issue_group_id_fkey" FOREIGN KEY ("issue_group_id") REFERENCES "IssueGroup"("issue_group_id") ON DELETE SET NULL ON UPDATE CASCADE;
