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
CREATE TABLE "Medecin" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "image" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "disponibilite" TEXT[],
    "villeId" INTEGER NOT NULL,
    "accepteNouveaux" BOOLEAN NOT NULL DEFAULT true,
    "secteur" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medecin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialite" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Specialite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ville" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Ville_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedecinSpecialite" (
    "id" SERIAL NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "specialiteId" INTEGER NOT NULL,

    CONSTRAINT "MedecinSpecialite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medecin_email_key" ON "Medecin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Specialite_nom_key" ON "Specialite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Ville_nom_key" ON "Ville"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "MedecinSpecialite_medecinId_specialiteId_key" ON "MedecinSpecialite"("medecinId", "specialiteId");

-- AddForeignKey
ALTER TABLE "Medecin" ADD CONSTRAINT "Medecin_villeId_fkey" FOREIGN KEY ("villeId") REFERENCES "Ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedecinSpecialite" ADD CONSTRAINT "MedecinSpecialite_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedecinSpecialite" ADD CONSTRAINT "MedecinSpecialite_specialiteId_fkey" FOREIGN KEY ("specialiteId") REFERENCES "Specialite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
