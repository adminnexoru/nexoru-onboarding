/*
  Warnings:

  - You are about to drop the column `suggestedPackageId` on the `OnboardingPrimaryGoal` table. All the data in the column will be lost.
  - Added the required column `needLabel` to the `OnboardingSecondaryNeed` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OnboardingPrimaryGoal" DROP CONSTRAINT "OnboardingPrimaryGoal_suggestedPackageId_fkey";

-- DropIndex
DROP INDEX "OnboardingSecondaryNeed_sessionId_needCode_key";

-- AlterTable
ALTER TABLE "OnboardingPrimaryGoal" DROP COLUMN "suggestedPackageId",
ADD COLUMN     "primaryGoalDescription" TEXT;

-- AlterTable
ALTER TABLE "OnboardingSecondaryNeed" ADD COLUMN     "needLabel" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "OnboardingSecondaryNeed_sessionId_idx" ON "OnboardingSecondaryNeed"("sessionId");
