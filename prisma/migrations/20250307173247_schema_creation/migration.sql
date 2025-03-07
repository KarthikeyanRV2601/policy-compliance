-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "PolicyTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PolicyTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PolicyTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
