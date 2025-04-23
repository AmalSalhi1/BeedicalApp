-- CreateTable
CREATE TABLE "User" (
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("clerkId")
);

-- CreateTable
CREATE TABLE "Profil" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "sexe" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "assuranceMaladie" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "userClerkId" TEXT NOT NULL,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favoris" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,

    CONSTRAINT "Favoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historique" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "rendezVousId" TEXT NOT NULL,

    CONSTRAINT "Historique_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Profil_cin_key" ON "Profil"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Favoris_userId_medecinId_key" ON "Favoris"("userId", "medecinId");

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favoris" ADD CONSTRAINT "Favoris_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historique" ADD CONSTRAINT "Historique_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
