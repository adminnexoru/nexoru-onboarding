/*
  Warnings:

  - You are about to drop the column `priceAmount` on the `Addon` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `Addon` table. All the data in the column will be lost.
  - Added the required column `monthlyPrice` to the `Addon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setupPrice` to the `Addon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Addon" DROP COLUMN "priceAmount",
DROP COLUMN "priceType",
ADD COLUMN     "monthlyPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "setupPrice" DECIMAL(10,2) NOT NULL;

-- DropEnum
DROP TYPE "AddonPriceType";
