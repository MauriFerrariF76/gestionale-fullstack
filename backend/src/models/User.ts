export type User = {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  passwordHash: string;
  roles: string[];
  mfaEnabled: boolean;
  // altri campi custom se necessario
}; 