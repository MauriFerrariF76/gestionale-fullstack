// File: index.ts
// Estensione: .ts
// Percorso completo: src/routes/clienti/index.ts
// Scopo: Definisce le API REST per la gestione dei clienti (CRUD) tramite Express e PostgreSQL
// Questo file espone le rotte per elencare, creare e modificare i clienti nel database.
import express, { Request, Response } from 'express';
import pool from '../../config/database';
import { Cliente } from '../../types/clienti/cliente';

const router = express.Router();

// Funzione di validazione base per Cliente
function validateCliente(data: Partial<Cliente>): boolean {
  return (
    typeof data.IdCliente === 'string' &&
    data.IdCliente.trim().length > 0 &&
    typeof data.RagioneSocialeC === 'string' &&
    data.RagioneSocialeC.trim().length > 0
  );
}

// Funzione per normalizzare tutti i campi del cliente (per INSERT)
function normalizeCliente(data: Partial<Cliente>): (string | boolean | number | null)[] {
  return [
    data.IdCliente ?? null,
    data.CodiceMT ?? null,
    data.RagioneSocialeC ?? null,
    data.ReferenteC ?? null,
    data.IndirizzoC ?? null,
    data.CAPc ?? null,
    data.CITTAc ?? null,
    data.PROVc ?? null,
    data.NAZc ?? null,
    data.IndirizzoC2 ?? null,
    data.CAPc2 ?? null,
    data.CITTAc2 ?? null,
    data.PROVc2 ?? null,
    data.NAZc2 ?? null,
    data.IndirizzoC3 ?? null,
    data.CAPc3 ?? null,
    data.CITTAc3 ?? null,
    data.PROVc3 ?? null,
    data.NAZc3 ?? null,
    data.IntestazioneSpedFat ?? null,
    data.IndirizzoC4 ?? null,
    data.CAPc4 ?? null,
    data.CITTAc4 ?? null,
    data.PROVc4 ?? null,
    data.SelezioneSpedFat ?? null,
    data.NoteSpedFat ?? null,
    data.DescrizionePagamentoC ?? null,
    data.MetodoPagamentoC ?? null,
    data.CondizioniPagamentoC ?? null,
    data.ResaC ?? null,
    data.TrasportoC ?? null,
    data.EffettivoPotenziale ?? null,
    data.CategoriaMerceologica ?? null,
    data.AttivoC ?? null,
    data.AttivoDalC ?? null,
    data.NonAttivoDalC ?? null,
    data.AnnoUltimoVendita ?? null,
    data.Telefono ?? null,
    data.Fax ?? null,
    data.Modem ?? null,
    data.CodiceFiscale ?? null,
    data.PartitaIva ?? null,
    data.BancaAppoggio ?? null,
    data.CodicePagamento ?? null,
    data.SitoInternet ?? null,
    data.EsenzioneIva ?? null,
    data.EmailFatturazione ?? null,
    data.CodiceFornitore ?? null,
    data.CIN ?? null,
    data.ABI ?? null,
    data.CAB ?? null,
    data.CC ?? null,
    data.CodiceIBAN ?? null,
    data.TipoSpedizioneC ?? null,
    data.Articolo15 ?? null,
    data.NostraBancaAppoggioC ?? null,
    data.IBANnostraBancaC ?? null,
    data.PercorsoCliente ?? null,
    data.PercorsoPDFClienteC ?? null,
    data.PercorsoDXFClienteC ?? null,
    data.Privato ?? null,
    data.IVA ?? null,
    data.EmailCertificati ?? null,
    data.CodiceSDI ?? null,
    data.PECcliente ?? null,
    data.SpeseBancarie ?? null,
    data.RichiesteCliente ?? null
  ];
}

// Funzione per normalizzare i campi per UPDATE (tutti tranne IdCliente)
function normalizeClienteForUpdate(data: Partial<Cliente>): (string | boolean | number | null)[] {
  return [
    data.CodiceMT ?? null,
    data.RagioneSocialeC ?? null,
    data.ReferenteC ?? null,
    data.IndirizzoC ?? null,
    data.CAPc ?? null,
    data.CITTAc ?? null,
    data.PROVc ?? null,
    data.NAZc ?? null,
    data.IndirizzoC2 ?? null,
    data.CAPc2 ?? null,
    data.CITTAc2 ?? null,
    data.PROVc2 ?? null,
    data.NAZc2 ?? null,
    data.IndirizzoC3 ?? null,
    data.CAPc3 ?? null,
    data.CITTAc3 ?? null,
    data.PROVc3 ?? null,
    data.NAZc3 ?? null,
    data.IntestazioneSpedFat ?? null,
    data.IndirizzoC4 ?? null,
    data.CAPc4 ?? null,
    data.CITTAc4 ?? null,
    data.PROVc4 ?? null,
    data.SelezioneSpedFat ?? null,
    data.NoteSpedFat ?? null,
    data.DescrizionePagamentoC ?? null,
    data.MetodoPagamentoC ?? null,
    data.CondizioniPagamentoC ?? null,
    data.ResaC ?? null,
    data.TrasportoC ?? null,
    data.EffettivoPotenziale ?? null,
    data.CategoriaMerceologica ?? null,
    data.AttivoC ?? null,
    data.AttivoDalC ?? null,
    data.NonAttivoDalC ?? null,
    data.AnnoUltimoVendita ?? null,
    data.Telefono ?? null,
    data.Fax ?? null,
    data.Modem ?? null,
    data.CodiceFiscale ?? null,
    data.PartitaIva ?? null,
    data.BancaAppoggio ?? null,
    data.CodicePagamento ?? null,
    data.SitoInternet ?? null,
    data.EsenzioneIva ?? null,
    data.EmailFatturazione ?? null,
    data.CodiceFornitore ?? null,
    data.CIN ?? null,
    data.ABI ?? null,
    data.CAB ?? null,
    data.CC ?? null,
    data.CodiceIBAN ?? null,
    data.TipoSpedizioneC ?? null,
    data.Articolo15 ?? null,
    data.NostraBancaAppoggioC ?? null,
    data.IBANnostraBancaC ?? null,
    data.PercorsoCliente ?? null,
    data.PercorsoPDFClienteC ?? null,
    data.PercorsoDXFClienteC ?? null,
    data.Privato ?? null,
    data.IVA ?? null,
    data.EmailCertificati ?? null,
    data.CodiceSDI ?? null,
    data.PECcliente ?? null,
    data.SpeseBancarie ?? null,
    data.RichiesteCliente ?? null
  ];
}

// Lista clienti (GET)
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY "IdCliente"');
    res.json(result.rows as Cliente[]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Errore API GET /api/clienti:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Errore API GET /api/clienti:', error);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
});

// Ottieni il valore massimo di IdCliente (GET /api/clienti/max-id)
router.get('/max-id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT "IdCliente",
             SPLIT_PART("IdCliente", '.', 2) AS parte_numerica,
             CAST(SPLIT_PART("IdCliente", '.', 2) AS INTEGER) AS numero
      FROM clienti
      WHERE "IdCliente" LIKE 'C00.%'
      ORDER BY numero DESC
    `);
    console.log('DEBUG /api/clienti/max-id - Tutti i risultati:', result.rows);
    const maxId = result.rows[0]?.IdCliente ?? null;
    console.log('DEBUG /api/clienti/max-id - maxIdCliente trovato:', maxId);
    res.json({ maxIdCliente: maxId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Errore API GET /api/clienti/max-id:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Errore API GET /api/clienti/max-id:', error);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
});

// Crea nuovo cliente (POST)
router.post('/', async (req: Request, res: Response) => {
  const data: Partial<Cliente> = req.body;
  if (!validateCliente(data)) {
    return res.status(400).json({ error: 'Dati cliente non validi' });
  }
  try {
    // Controllo univocità IdCliente
    if (!data.IdCliente || typeof data.IdCliente !== 'string' || data.IdCliente.trim() === '') {
      return res.status(400).json({ error: 'ID Cliente obbligatorio' });
    }
    const check = await pool.query(
      'SELECT 1 FROM clienti WHERE "IdCliente" = $1 LIMIT 1',
      [data.IdCliente]
    );
    if ((check.rowCount ?? 0) > 0) {
      return res.status(409).json({ error: 'ID Cliente già esistente' });
    }

    const values = normalizeCliente(data);
    const result = await pool.query(
      `INSERT INTO clienti (
        "IdCliente", "CodiceMT", "RagioneSocialeC", "ReferenteC", "IndirizzoC", "CAPc", "CITTAc", "PROVc", "NAZc",
        "IndirizzoC2", "CAPc2", "CITTAc2", "PROVc2", "NAZc2",
        "IndirizzoC3", "CAPc3", "CITTAc3", "PROVc3", "NAZc3",
        "IntestazioneSpedFat", "IndirizzoC4", "CAPc4", "CITTAc4", "PROVc4",
        "SelezioneSpedFat", "NoteSpedFat", "DescrizionePagamentoC", "MetodoPagamentoC", "CondizioniPagamentoC",
        "ResaC", "TrasportoC", "EffettivoPotenziale", "CategoriaMerceologica", "AttivoC", "AttivoDalC", "NonAttivoDalC",
        "AnnoUltimoVendita", "Telefono", "Fax", "Modem", "CodiceFiscale", "PartitaIva", "BancaAppoggio", "CodicePagamento",
        "SitoInternet", "EsenzioneIva", "EmailFatturazione", "CodiceFornitore", "CIN", "ABI", "CAB", "CC", "CodiceIBAN",
        "TipoSpedizioneC", "Articolo15", "NostraBancaAppoggioC", "IBANnostraBancaC", "PercorsoCliente", "PercorsoPDFClienteC",
        "PercorsoDXFClienteC", "Privato", "IVA", "EmailCertificati", "CodiceSDI", "PECcliente", "SpeseBancarie", "RichiesteCliente"
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24,
        $25,$26,$27,$28,$29,
        $30,$31,$32,$33,$34,$35,$36,
        $37,$38,$39,$40,$41,$42,$43,$44,
        $45,$46,$47,$48,$49,$50,$51,$52,$53,
        $54,$55,$56,$57,$58,$59,$60,$61,$62,$63,$64,$65,$66,$67
      ) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0] as Cliente);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Errore API POST /api/clienti:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Errore API POST /api/clienti:', error);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
});

// Modifica cliente esistente (PUT)
router.put('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const data: Partial<Cliente> = req.body;
  if (!validateCliente(data)) {
    return res.status(400).json({ error: 'Dati cliente non validi' });
  }
  try {
    // Controllo che il cliente esista
    const clienteEsistente = await pool.query(
      'SELECT 1 FROM clienti WHERE "IdCliente" = $1 LIMIT 1',
      [id]
    );
    if ((clienteEsistente.rowCount ?? 0) === 0) {
      return res.status(404).json({ error: 'Cliente non trovato' });
    }

    // Controllo univocità SOLO se l'ID cambia
    if (data.IdCliente && data.IdCliente !== id) {
      const check = await pool.query(
        'SELECT 1 FROM clienti WHERE "IdCliente" = $1 LIMIT 1',
        [data.IdCliente]
      );
      if ((check.rowCount ?? 0) > 0) {
        return res.status(409).json({ error: 'ID Cliente già esistente' });
      }
    }

    const values = normalizeClienteForUpdate(data);
    values.push(id); // l'ultimo valore è l'id per il WHERE
    const result = await pool.query(
      `UPDATE clienti SET
        "CodiceMT"=$1, "RagioneSocialeC"=$2, "ReferenteC"=$3, "IndirizzoC"=$4, "CAPc"=$5, "CITTAc"=$6, "PROVc"=$7, "NAZc"=$8,
        "IndirizzoC2"=$9, "CAPc2"=$10, "CITTAc2"=$11, "PROVc2"=$12, "NAZc2"=$13,
        "IndirizzoC3"=$14, "CAPc3"=$15, "CITTAc3"=$16, "PROVc3"=$17, "NAZc3"=$18,
        "IntestazioneSpedFat"=$19, "IndirizzoC4"=$20, "CAPc4"=$21, "CITTAc4"=$22, "PROVc4"=$23,
        "SelezioneSpedFat"=$24, "NoteSpedFat"=$25, "DescrizionePagamentoC"=$26, "MetodoPagamentoC"=$27, "CondizioniPagamentoC"=$28,
        "ResaC"=$29, "TrasportoC"=$30, "EffettivoPotenziale"=$31, "CategoriaMerceologica"=$32, "AttivoC"=$33, "AttivoDalC"=$34, "NonAttivoDalC"=$35,
        "AnnoUltimoVendita"=$36, "Telefono"=$37, "Fax"=$38, "Modem"=$39, "CodiceFiscale"=$40, "PartitaIva"=$41, "BancaAppoggio"=$42, "CodicePagamento"=$43,
        "SitoInternet"=$44, "EsenzioneIva"=$45, "EmailFatturazione"=$46, "CodiceFornitore"=$47, "CIN"=$48, "ABI"=$49, "CAB"=$50, "CC"=$51, "CodiceIBAN"=$52,
        "TipoSpedizioneC"=$53, "Articolo15"=$54, "NostraBancaAppoggioC"=$55, "IBANnostraBancaC"=$56, "PercorsoCliente"=$57, "PercorsoPDFClienteC"=$58,
        "PercorsoDXFClienteC"=$59, "Privato"=$60, "IVA"=$61, "EmailCertificati"=$62, "CodiceSDI"=$63, "PECcliente"=$64, "SpeseBancarie"=$65, "RichiesteCliente"=$66
      WHERE "IdCliente"=$67 RETURNING *`,
      values
    );
    res.json(result.rows[0] as Cliente);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Errore API PUT /api/clienti/:id:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Errore API PUT /api/clienti/:id:', error);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
});

export default router;