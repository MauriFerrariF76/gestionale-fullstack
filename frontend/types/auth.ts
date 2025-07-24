// Tipi base per autenticazione e sicurezza

export type JwtAccessToken = {
  sub: string; // user id
  email: string;
  roles: string[];
  exp: number; // timestamp di scadenza
  iat: number; // issued at
  // altri claim custom se necessari
};

export type JwtRefreshToken = {
  sub: string; // user id
  exp: number;
  iat: number;
  // altri claim custom se necessari
};

export type User = {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  roles: string[];
  mfaEnabled: boolean;
  // altri campi custom (es. permessi, avatar, ecc.)
};
