-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clienti" (
    "id" TEXT NOT NULL,
    "codiceMT" TEXT,
    "ragioneSocialeC" TEXT,
    "referenteC" TEXT,
    "indirizzoC" TEXT,
    "capc" TEXT,
    "cittac" TEXT,
    "provc" TEXT,
    "nazc" TEXT,
    "indirizzoC2" TEXT,
    "capc2" TEXT,
    "cittac2" TEXT,
    "provc2" TEXT,
    "nazc2" TEXT,
    "indirizzoC3" TEXT,
    "capc3" TEXT,
    "cittac3" TEXT,
    "provc3" TEXT,
    "nazc3" TEXT,
    "intestazioneSpedFat" TEXT,
    "indirizzoC4" TEXT,
    "capc4" TEXT,
    "cittac4" TEXT,
    "provc4" TEXT,
    "selezioneSpedFat" BOOLEAN NOT NULL DEFAULT false,
    "noteSpedFat" TEXT,
    "descrizionePagamentoC" TEXT,
    "metodoPagamentoC" TEXT,
    "condizioniPagamentoC" TEXT,
    "resaC" TEXT,
    "trasportoC" TEXT,
    "effettivoPotenziale" TEXT,
    "categoriaMerceologica" TEXT,
    "attivoC" BOOLEAN NOT NULL DEFAULT true,
    "attivoDalC" TIMESTAMP(3),
    "nonAttivoDalC" TIMESTAMP(3),
    "annoUltimoVendita" TEXT,
    "telefono" TEXT,
    "fax" TEXT,
    "modem" TEXT,
    "codiceFiscale" TEXT,
    "partitaIva" TEXT,
    "bancaAppoggio" TEXT,
    "codicePagamento" TEXT,
    "sitoInternet" TEXT,
    "esenzioneIva" TEXT,
    "emailFatturazione" TEXT,
    "codiceFornitore" TEXT,
    "cin" TEXT,
    "abi" TEXT,
    "cab" TEXT,
    "cc" TEXT,
    "codiceIBAN" TEXT,
    "tipoSpedizioneC" TEXT,
    "articolo15" TEXT,
    "nostraBancaAppoggioC" TEXT,
    "ibanNostraBancaC" TEXT,
    "percorsoCliente" TEXT,
    "percorsoPDFClienteC" TEXT,
    "percorsoDXFClienteC" TEXT,
    "privato" BOOLEAN NOT NULL DEFAULT false,
    "iva" TEXT,
    "emailCertificati" TEXT,
    "codiceSDI" TEXT,
    "pecCliente" TEXT,
    "speseBancarie" TEXT,
    "richiesteCliente" TEXT,
    "tipoCliente" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clienti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fornitori" (
    "id" TEXT NOT NULL,
    "codiceMT" TEXT,
    "ragioneSocialeF" TEXT,
    "referenteF" TEXT,
    "indirizzoF" TEXT,
    "capf" TEXT,
    "cittaf" TEXT,
    "provf" TEXT,
    "nazf" TEXT,
    "telefono" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "sitoInternet" TEXT,
    "codiceFiscale" TEXT,
    "partitaIva" TEXT,
    "attivoF" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornitori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clienti_codiceMT_key" ON "public"."clienti"("codiceMT");

-- CreateIndex
CREATE UNIQUE INDEX "fornitori_codiceMT_key" ON "public"."fornitori"("codiceMT");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "public"."refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
