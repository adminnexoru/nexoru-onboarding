/*
  Warnings:

  - Added the required column `optionType` to the `GoalOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoalOption" ADD COLUMN     "optionType" TEXT NOT NULL;
