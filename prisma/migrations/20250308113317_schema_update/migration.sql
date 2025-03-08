/*
  Warnings:

  - You are about to drop the column `ackType` on the `Acknowledgement` table. All the data in the column will be lost.
  - Added the required column `acknowledgementType` to the `Acknowledgement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policyVersion` to the `Acknowledgement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Acknowledgement" DROP COLUMN "ackType",
ADD COLUMN     "acknowledgementType" TEXT NOT NULL,
ADD COLUMN     "policyVersion" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AcknowledgementRequest" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "escalationSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AcknowledgementRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcknowledgementRequest" ADD CONSTRAINT "AcknowledgementRequest_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcknowledgementRequest" ADD CONSTRAINT "AcknowledgementRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
