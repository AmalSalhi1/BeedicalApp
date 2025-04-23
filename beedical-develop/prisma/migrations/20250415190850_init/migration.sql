/*
  Warnings:

  - You are about to drop the column `userClerkId` on the `Profil` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Profil` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Profil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Profil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profil" DROP CONSTRAINT "Profil_userClerkId_fkey";

-- AlterTable
ALTER TABLE "Profil" DROP COLUMN "userClerkId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profil_userId_key" ON "Profil"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profil_email_key" ON "Profil"("email");

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
