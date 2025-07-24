import { NextResponse } from "next/server";

// Dati mock per testare il frontend
const clientiMock = [
  {
    IdCliente: "C00.0019",
    CodiceMT: "MT001",
    RagioneSocialeC: "Ferrari Pietro Snc",
    ReferenteC: "Mario Rossi",
    IndirizzoC: "Via Roma 123",
    CAPc: "12345",
    CITTAc: "Milano",
    PROVc: "MI",
    NAZc: "Italia",
    IndirizzoC2: "",
    CAPc2: "",
    CITTAc2: "",
    PROVc2: "",
    NAZc2: "",
    IndirizzoC3: "",
    CAPc3: "",
    CITTAc3: "",
    PROVc3: "",
    NAZc3: "",
    IntestazioneSpedFat: "Ferrari Pietro Snc",
    IndirizzoC4: "Via Roma 123",
    CAPc4: "12345",
    CITTAc4: "Milano",
    PROVc4: "MI",
    SelezioneSpedFat: true,
    NoteSpedFat: "",
    DescrizionePagamentoC: "Bonifico bancario",
    MetodoPagamentoC: "MP05",
    CondizioniPagamentoC: "30",
    ResaC: "FCA",
    TrasportoC: "Vettore",
    EffettivoPotenziale: "Effettivo",
    CategoriaMerceologica: "Carpenteria meccanica",
    AttivoC: true,
    AttivoDalC: "2024-01-01",
    NonAttivoDalC: "",
    AnnoUltimoVendita: "2024",
    Telefono: "02 1234567",
    Fax: "",
    Modem: "",
    CodiceFiscale: "FRRPTR80A01H501U",
    PartitaIva: "IT12345678901",
    BancaAppoggio: "Banca Popolare di Milano",
    CodicePagamento: "BP001",
    SitoInternet: "www.ferraripietro.it",
    EsenzioneIva: "",
    EmailFatturazione: "fatturazione@ferraripietro.it",
    CodiceFornitore: "",
    CIN: "",
    ABI: "",
    CAB: "",
    CC: "",
    CodiceIBAN: "IT60X0542811101000000123456",
    TipoSpedizioneC: "Cedente",
    Articolo15: "",
    NostraBancaAppoggioC: "",
    IBANnostraBancaC: "",
    PercorsoCliente: "/clienti/ferrari",
    PercorsoPDFClienteC: "",
    PercorsoDXFClienteC: "",
    Privato: false,
    IVA: "22",
    EmailCertificati: "certificati@ferraripietro.it",
    CodiceSDI: "0000000",
    PECcliente: "ferraripietro@pec.it",
    SpeseBancarie: "0",
    RichiesteCliente: "Cliente storico, molto affidabile",
  },
  {
    IdCliente: "C00.0020",
    CodiceMT: "MT002",
    RagioneSocialeC: "Bianchi SRL",
    ReferenteC: "Giuseppe Bianchi",
    IndirizzoC: "Via Garibaldi 456",
    CAPc: "54321",
    CITTAc: "Roma",
    PROVc: "RM",
    NAZc: "Italia",
    IndirizzoC2: "",
    CAPc2: "",
    CITTAc2: "",
    PROVc2: "",
    NAZc2: "",
    IndirizzoC3: "",
    CAPc3: "",
    CITTAc3: "",
    PROVc3: "",
    NAZc3: "",
    IntestazioneSpedFat: "Bianchi SRL",
    IndirizzoC4: "Via Garibaldi 456",
    CAPc4: "54321",
    CITTAc4: "Roma",
    PROVc4: "RM",
    SelezioneSpedFat: false,
    NoteSpedFat: "",
    DescrizionePagamentoC: "Assegno",
    MetodoPagamentoC: "MP02",
    CondizioniPagamentoC: "vista",
    ResaC: "EXW",
    TrasportoC: "Cliente",
    EffettivoPotenziale: "Potenziale",
    CategoriaMerceologica: "Industria",
    AttivoC: true,
    AttivoDalC: "2024-02-01",
    NonAttivoDalC: "",
    AnnoUltimoVendita: "2024",
    Telefono: "06 9876543",
    Fax: "",
    Modem: "",
    CodiceFiscale: "BNCGSP75B15H501X",
    PartitaIva: "IT98765432109",
    BancaAppoggio: "Unicredit",
    CodicePagamento: "UNI001",
    SitoInternet: "www.bianchisrl.it",
    EsenzioneIva: "",
    EmailFatturazione: "amministrazione@bianchisrl.it",
    CodiceFornitore: "",
    CIN: "",
    ABI: "",
    CAB: "",
    CC: "",
    CodiceIBAN: "IT60X0542811101000000987654",
    TipoSpedizioneC: "Cessionario",
    Articolo15: "",
    NostraBancaAppoggioC: "",
    IBANnostraBancaC: "",
    PercorsoCliente: "/clienti/bianchi",
    PercorsoPDFClienteC: "",
    PercorsoDXFClienteC: "",
    Privato: false,
    IVA: "22",
    EmailCertificati: "certificati@bianchisrl.it",
    CodiceSDI: "0000000",
    PECcliente: "bianchisrl@pec.it",
    SpeseBancarie: "0",
    RichiesteCliente: "Nuovo cliente, da seguire attentamente",
  },
];

// GET /api/clienti - Lista tutti i clienti
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const exists = clientiMock.some((c) => c.IdCliente === id);
    return NextResponse.json({ exists });
  }
  // Se non c'è parametro id, restituisci la lista clienti (comportamento originale)
  return NextResponse.json(clientiMock);
}

// POST /api/clienti - Crea nuovo cliente
export async function POST(request: Request) {
  try {
    const nuovoCliente = await request.json();
    // Controllo univocità IdCliente
    if (clientiMock.some((c) => c.IdCliente === nuovoCliente.IdCliente)) {
      return NextResponse.json(
        { error: "ID Cliente già esistente" },
        { status: 409 }
      );
    }
    // Aggiungi il nuovo cliente alla lista
    clientiMock.push(nuovoCliente);
    return NextResponse.json({
      success: true,
      message: `Cliente \"${nuovoCliente.RagioneSocialeC}\" creato con successo!`,
      cliente: nuovoCliente,
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la creazione del cliente" },
      { status: 500 }
    );
  }
}
