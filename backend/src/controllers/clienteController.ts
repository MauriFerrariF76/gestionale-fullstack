// File: clienteController.ts
// Scopo: Controller per la gestione delle richieste API relative ai clienti
// Percorso: src/controllers/clienteController.ts
//
// Questo file gestisce tutte le operazioni HTTP per i clienti
// utilizzando il repository Prisma per l'accesso al database.

import { Request, Response } from 'express';
import clienteRepository from '../repositories/clienteRepository';
import { createAuditLog } from '../utils/auditLogger';
import { mapClienteFields, mapClienteFieldsToFrontend } from '../utils/fieldMapper';

export class ClienteController {
  // GET /api/clienti - Ottieni tutti i clienti con paginazione
  async getClienti(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const authUser = (req as any).user as { id?: string } | undefined;

      const result = await clienteRepository.findAll(page, limit, search);

      // Mappa i campi dal backend al frontend
      const mappedClienti = result.clienti.map(cliente => mapClienteFieldsToFrontend(cliente));

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'GET_CLIENTI',
        ip: (req.ip || '') as string,
        details: `Page: ${page}, Limit: ${limit}, Search: ${search || 'none'}`
      });

      res.json({
        success: true,
        data: mappedClienti,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('❌ Errore nel recupero clienti:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // GET /api/clienti/:id - Ottieni cliente specifico
  async getCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authUser = (req as any).user as { id?: string } | undefined;
      const cliente = await clienteRepository.findById(id);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      // Mappa i campi dal backend al frontend
      const mappedCliente = mapClienteFieldsToFrontend(cliente);

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'GET_CLIENTE',
        ip: (req.ip || '') as string,
        details: `Cliente ID: ${id}`
      });

      res.json({
        success: true,
        data: mappedCliente
      });
    } catch (error) {
      console.error('❌ Errore nel recupero cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // POST /api/clienti - Crea nuovo cliente
  async createCliente(req: Request, res: Response) {
    try {
      const clienteData = req.body;
      const authUser = (req as any).user as { id?: string } | undefined;

      // Mappa i campi dal frontend al backend
      const mappedData = mapClienteFields(clienteData);

      // Validazione base
      if (!mappedData.ragioneSocialeC) {
        return res.status(400).json({
          success: false,
          message: 'Ragione sociale è obbligatoria'
        });
      }

      // Verifica se codice MT esiste già
      if (mappedData.codiceMT) {
        const existingCliente = await clienteRepository.findByCodiceMT(mappedData.codiceMT);
        if (existingCliente) {
          return res.status(409).json({
            success: false,
            message: 'Codice MT già esistente'
          });
        }
      }

      const nuovoCliente = await clienteRepository.create(mappedData);

      // Mappa i campi dal backend al frontend per la risposta
      const mappedNuovoCliente = mapClienteFieldsToFrontend(nuovoCliente);

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'CREATE_CLIENTE',
        ip: (req.ip || '') as string,
        details: `Nuovo cliente: ${nuovoCliente.ragioneSocialeC}`
      });

      res.status(201).json({
        success: true,
        message: 'Cliente creato con successo',
        data: mappedNuovoCliente
      });
    } catch (error) {
      console.error('❌ Errore nella creazione cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // PUT /api/clienti/:id - Aggiorna cliente
  async updateCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const authUser = (req as any).user as { id?: string } | undefined;

      // Mappa i campi dal frontend al backend
      const mappedUpdateData = mapClienteFields(updateData);

      // Verifica se cliente esiste
      const existingCliente = await clienteRepository.findById(id);
      if (!existingCliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      // Verifica codice MT se modificato
      if (mappedUpdateData.codiceMT && mappedUpdateData.codiceMT !== existingCliente.codiceMT) {
        const existingWithCodice = await clienteRepository.findByCodiceMT(mappedUpdateData.codiceMT);
        if (existingWithCodice) {
          return res.status(409).json({
            success: false,
            message: 'Codice MT già esistente'
          });
        }
      }

      const clienteAggiornato = await clienteRepository.update(id, mappedUpdateData);

      // Mappa i campi dal backend al frontend per la risposta
      const mappedClienteAggiornato = mapClienteFieldsToFrontend(clienteAggiornato);

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'UPDATE_CLIENTE',
        ip: (req.ip || '') as string,
        details: `Cliente aggiornato: ${clienteAggiornato.ragioneSocialeC}`
      });

      res.json({
        success: true,
        message: 'Cliente aggiornato con successo',
        data: mappedClienteAggiornato
      });
    } catch (error) {
      console.error('❌ Errore nell\'aggiornamento cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // DELETE /api/clienti/:id - Elimina cliente
  async deleteCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authUser = (req as any).user as { id?: string } | undefined;

      // Verifica se cliente esiste
      const existingCliente = await clienteRepository.findById(id);
      if (!existingCliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      await clienteRepository.delete(id);

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'DELETE_CLIENTE',
        ip: (req.ip || '') as string,
        details: `Cliente eliminato: ${existingCliente.ragioneSocialeC}`
      });

      res.json({
        success: true,
        message: 'Cliente eliminato con successo'
      });
    } catch (error) {
      console.error('❌ Errore nell\'eliminazione cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // GET /api/clienti/stats - Ottieni statistiche clienti
  async getStats(req: Request, res: Response) {
    try {
      const authUser = (req as any).user as { id?: string } | undefined;
      const stats = await clienteRepository.getStats();

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'GET_CLIENTI_STATS',
        ip: (req.ip || '') as string,
        details: 'Statistiche clienti richieste'
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Errore nel recupero statistiche:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // GET /api/clienti/search - Cerca clienti
  async searchClienti(req: Request, res: Response) {
    try {
      const { term, limit } = req.query;
      const authUser = (req as any).user as { id?: string } | undefined;
      
      if (!term || typeof term !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Termine di ricerca obbligatorio'
        });
      }

      const limitNum = limit ? parseInt(limit as string) : 10;
      const risultati = await clienteRepository.search(term, limitNum);

      // Mappa i campi dal backend al frontend
      const mappedRisultati = risultati.map(cliente => mapClienteFieldsToFrontend(cliente));

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'SEARCH_CLIENTI',
        ip: (req.ip || '') as string,
        details: `Ricerca: "${term}", Risultati: ${risultati.length}`
      });

      res.json({
        success: true,
        data: mappedRisultati
      });
    } catch (error) {
      console.error('❌ Errore nella ricerca clienti:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  // GET /api/clienti/max-id - Ottieni il massimo ID cliente
  async getMaxIdCliente(req: Request, res: Response) {
    try {
      const authUser = (req as any).user as { id?: string } | undefined;
      
      // Ottieni tutti i clienti per trovare il massimo ID
      const result = await clienteRepository.findAll(1, 1000); // Limite alto per ottenere tutti
      const clienti = result.clienti;
      
      let maxId = "C00.0000"; // ID di default
      
      if (clienti.length > 0) {
        // Trova il massimo ID numerico
        const idNumerici = clienti
          .map(cliente => cliente.id)
          .filter(id => id && id.match(/^C\d{2}\.\d{4}$/)) // Solo ID nel formato C00.0000
          .map(id => {
            const match = id.match(/^C(\d{2})\.(\d{4})$/);
            if (match) {
              return parseInt(match[1] + match[2]);
            }
            return 0;
          });
        
        if (idNumerici.length > 0) {
          const maxNum = Math.max(...idNumerici);
          const sezione = Math.floor(maxNum / 10000);
          const numero = maxNum % 10000;
          maxId = `C${sezione.toString().padStart(2, '0')}.${numero.toString().padStart(4, '0')}`;
        }
      }

      // Log audit
      await createAuditLog({
        userId: authUser?.id,
        action: 'GET_MAX_ID_CLIENTE',
        ip: (req.ip || '') as string,
        details: `Massimo ID cliente: ${maxId}`
      });

      res.json({
        success: true,
        data: {
          maxIdCliente: maxId
        }
      });
    } catch (error) {
      console.error('❌ Errore nel recupero massimo ID cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Errore interno del server',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
}

export default new ClienteController();
