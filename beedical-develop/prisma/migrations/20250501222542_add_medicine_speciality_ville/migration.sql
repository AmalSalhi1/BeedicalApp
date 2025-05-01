/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Profil` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proche" ALTER COLUMN "dateNaissance" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profil" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "dateNaissance" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "specialityId" TEXT,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speciality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ville" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,

    CONSTRAINT "Ville_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medecin" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT,
    "specialityId" TEXT NOT NULL,
    "villeId" TEXT NOT NULL,

    CONSTRAINT "Medecin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MedecinToMedicine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MedecinToMedicine_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "Speciality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ville_name_key" ON "Ville"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_email_key" ON "Medecin"("email");

-- CreateIndex
CREATE INDEX "_MedecinToMedicine_B_index" ON "_MedecinToMedicine"("B");

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medecin" ADD CONSTRAINT "Medecin_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medecin" ADD CONSTRAINT "Medecin_villeId_fkey" FOREIGN KEY ("villeId") REFERENCES "Ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedecinToMedicine" ADD CONSTRAINT "_MedecinToMedicine_A_fkey" FOREIGN KEY ("A") REFERENCES "Medecin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedecinToMedicine" ADD CONSTRAINT "_MedecinToMedicine_B_fkey" FOREIGN KEY ("B") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
