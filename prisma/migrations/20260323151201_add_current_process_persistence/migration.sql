/*
  Warnings:

  - You are about to drop the column `currentTools` on the `OnboardingCurrentProcess` table. All the data in the column will be lost.
  - You are about to drop the column `processDescription` on the `OnboardingCurrentProcess` table. All the data in the column will be lost.
  - Added the required column `currentProcess` to the `OnboardingCurrentProcess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnboardingCurrentProcess" DROP COLUMN "currentTools",
DROP COLUMN "processDescription",
ADD COLUMN     "currentProcess" TEXT NOT NULL,
ADD COLUMN     "toolsUsed" TEXT;
