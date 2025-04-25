-- CreateTable
CREATE TABLE "RendezVous" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "patientId" TEXT,
    "procheId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disponibilite" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "medecinId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disponibilite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_procheId_fkey" FOREIGN KEY ("procheId") REFERENCES "Proche"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilite" ADD CONSTRAINT "Disponibilite_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "Medecin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
