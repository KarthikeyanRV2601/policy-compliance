/*
  Warnings:

  - You are about to drop the column `templateId` on the `Policy` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Policy" DROP CONSTRAINT "Policy_templateId_fkey";

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "templateId";
