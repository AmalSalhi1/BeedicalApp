/*
  Warnings:

  - You are about to drop the column `name` on the `Ville` table. All the data in the column will be lost.
  - You are about to drop the `Medecin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Speciality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MedecinToMedicine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nom]` on the table `Ville` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nom` to the `Ville` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favoris" DROP CONSTRAINT "Favoris_medecinId_fkey";

-- DropForeignKey
ALTER TABLE "Medecin" DROP CONSTRAINT "Medecin_specialityId_fkey";

-- DropForeignKey
ALTER TABLE "Medecin" DROP CONSTRAINT "Medecin_villeId_fkey";

-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_specialityId_fkey";

-- DropForeignKey
ALTER TABLE "_MedecinToMedicine" DROP CONSTRAINT "_MedecinToMedicine_A_fkey";

-- DropForeignKey
ALTER TABLE "_MedecinToMedicine" DROP CONSTRAINT "_MedecinToMedicine_B_fkey";

-- DropIndex
DROP INDEX "Ville_name_key";

-- AlterTable
ALTER TABLE "Ville" DROP COLUMN "name",
ADD COLUMN     "nom" TEXT NOT NULL;

-- DropTable
DROP TABLE "Medecin";

-- DropTable
DROP TABLE "Medicine";

-- DropTable
DROP TABLE "Speciality";

-- DropTable
DROP TABLE "_MedecinToMedicine";

-- CreateTable
CREATE TABLE "Specialite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Specialite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeMedecins" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "specialiteId" TEXT NOT NULL,
    "villeId" TEXT NOT NULL,

    CONSTRAINT "ListeMedecins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialite_nom_key" ON "Specialite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Ville_nom_key" ON "Ville"("nom");

-- AddForeignKey
ALTER TABLE "ListeMedecins" ADD CONSTRAINT "ListeMedecins_specialiteId_fkey" FOREIGN KEY ("specialiteId") REFERENCES "Specialite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeMedecins" ADD CONSTRAINT "ListeMedecins_villeId_fkey" FOREIGN KEY ("villeId") REFERENCES "Ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
