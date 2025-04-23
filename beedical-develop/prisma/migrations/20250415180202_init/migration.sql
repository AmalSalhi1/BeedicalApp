/*
  Warnings:

  - Added the required column `adresse` to the `Profil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `Profil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lieuNaissance` to the `Profil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profil" ADD COLUMN     "adresse" TEXT NOT NULL,
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "lieuNaissance" TEXT NOT NULL,
ADD COLUMN     "photoProfil" TEXT;

-- CreateTable
CREATE TABLE "Proche" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "sexe" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "lieuNaissance" TEXT NOT NULL,
    "photoProfil" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "userAccountId" TEXT,

    CONSTRAINT "Proche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcheGere" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "procheId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "ProcheGere_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proche_userAccountId_key" ON "Proche"("userAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcheGere_userId_procheId_key" ON "ProcheGere"("userId", "procheId");

-- AddForeignKey
ALTER TABLE "Proche" ADD CONSTRAINT "Proche_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcheGere" ADD CONSTRAINT "ProcheGere_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcheGere" ADD CONSTRAINT "ProcheGere_procheId_fkey" FOREIGN KEY ("procheId") REFERENCES "Proche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
