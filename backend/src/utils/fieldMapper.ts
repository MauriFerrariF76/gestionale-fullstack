// File: fieldMapper.ts
// Scopo: Utilità per mappare i nomi dei campi dal frontend al backend
// Percorso: src/utils/fieldMapper.ts
//
// Questo file contiene funzioni per convertire i nomi dei campi
// dal formato PascalCase (frontend) al formato camelCase (backend)

// Mappa dei campi cliente dal frontend al backend
const clienteFieldMap: Record<string, string> = {
  // Campi anagrafici
  'IdCliente': 'id',
  'CodiceMT': 'codiceMT',
  'RagioneSocialeC': 'ragioneSocialeC',
  'ReferenteC': 'referenteC',
  'IndirizzoC': 'indirizzoC',
  'CAPc': 'capc',
  'CITTAc': 'cittac',
  'PROVc': 'provc',
  'NAZc': 'nazc',
  
  // Indirizzi aggiuntivi
  'IndirizzoC2': 'indirizzoC2',
  'CAPc2': 'capc2',
  'CITTAc2': 'cittac2',
  'PROVc2': 'provc2',
  'NAZc2': 'nazc2',
  'IndirizzoC3': 'indirizzoC3',
  'CAPc3': 'capc3',
  'CITTAc3': 'cittac3',
  'PROVc3': 'provc3',
  'NAZc3': 'nazc3',
  'IndirizzoC4': 'indirizzoC4',
  'CAPc4': 'capc4',
  'CITTAc4': 'cittac4',
  'PROVc4': 'provc4',
  
  // Fatturazione
  'IntestazioneSpedFat': 'intestazioneSpedFat',
  'SelezioneSpedFat': 'selezioneSpedFat',
  'NoteSpedFat': 'noteSpedFat',
  'DescrizionePagamentoC': 'descrizionePagamentoC',
  'MetodoPagamentoC': 'metodoPagamentoC',
  'CondizioniPagamentoC': 'condizioniPagamentoC',
  'ResaC': 'resaC',
  'TrasportoC': 'trasportoC',
  
  // Categorizzazione
  'EffettivoPotenziale': 'effettivoPotenziale',
  'CategoriaMerceologica': 'categoriaMerceologica',
  'AttivoC': 'attivoC',
  'AttivoDalC': 'attivoDalC',
  'NonAttivoDalC': 'nonAttivoDalC',
  'AnnoUltimoVendita': 'annoUltimoVendita',
  
  // Contatti
  'Telefono': 'telefono',
  'Fax': 'fax',
  'Modem': 'modem',
  
  // Dati fiscali
  'CodiceFiscale': 'codiceFiscale',
  'PartitaIva': 'partitaIva',
  'IVA': 'iva',
  'EsenzioneIva': 'esenzioneIva',
  
  // Banca
  'BancaAppoggio': 'bancaAppoggio',
  'CodicePagamento': 'codicePagamento',
  'CIN': 'cin',
  'ABI': 'abi',
  'CAB': 'cab',
  'CC': 'cc',
  'CodiceIBAN': 'codiceIBAN',
  'NostraBancaAppoggioC': 'nostraBancaAppoggioC',
  'IBANnostraBancaC': 'ibanNostraBancaC',
  
  // Altri campi
  'SitoInternet': 'sitoInternet',
  'EmailFatturazione': 'emailFatturazione',
  'CodiceFornitore': 'codiceFornitore',
  'TipoSpedizioneC': 'tipoSpedizioneC',
  'Articolo15': 'articolo15',
  'PercorsoCliente': 'percorsoCliente',
  'PercorsoPDFClienteC': 'percorsoPDFClienteC',
  'PercorsoDXFClienteC': 'percorsoDXFClienteC',
  'Privato': 'privato',
  'EmailCertificati': 'emailCertificati',
  'CodiceSDI': 'codiceSDI',
  'PECcliente': 'pecCliente',
  'SpeseBancarie': 'speseBancarie',
  'RichiesteCliente': 'richiesteCliente',
};

/**
 * Converte i nomi dei campi di un oggetto cliente dal formato frontend al formato backend
 * @param clienteData - Oggetto cliente con nomi dei campi in PascalCase
 * @returns Oggetto cliente con nomi dei campi in camelCase
 */
export function mapClienteFields(clienteData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(clienteFieldMap)) {
    if (clienteData.hasOwnProperty(frontendField)) {
      mappedData[backendField] = clienteData[frontendField];
    }
  }
  
  return mappedData;
}

/**
 * Converte i nomi dei campi di un oggetto cliente dal formato backend al formato frontend
 * @param clienteData - Oggetto cliente con nomi dei campi in camelCase
 * @returns Oggetto cliente con nomi dei campi in PascalCase
 */
export function mapClienteFieldsToFrontend(clienteData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(clienteFieldMap)) {
    if (clienteData.hasOwnProperty(backendField)) {
      mappedData[frontendField] = clienteData[backendField];
    }
  }
  
  return mappedData;
}
