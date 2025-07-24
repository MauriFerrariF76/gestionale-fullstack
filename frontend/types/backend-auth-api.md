# Pianificazione API Backend - Autenticazione

## Endpoint necessari

### 1. POST /api/auth/login

- **Input:** { email, password, mfaCode? }
- **Output:** { accessToken, refreshToken, user }
- **Note:** Se MFA abilitato, richiede mfaCode

### 2. POST /api/auth/refresh

- **Input:** { refreshToken }
- **Output:** { accessToken, refreshToken }

### 3. POST /api/auth/mfa/verify

- **Input:** { userId, mfaCode }
- **Output:** { success, accessToken, refreshToken }

### 4. POST /api/auth/logout

- **Input:** { refreshToken }
- **Output:** { success }

### 5. GET /api/auth/userinfo

- **Headers:** Authorization: Bearer <accessToken>
- **Output:** { user }

### 6. POST /api/auth/log

- **Input:** { userId, action, ip, timestamp, details? }
- **Output:** { success }

## Note tecniche

- Tutti i token JWT devono essere firmati RS256
- I refresh token devono essere ruotati ad ogni uso
- MFA supporta TOTP e (opzionale) WebAuthn
- Audit log per ogni azione di autenticazione
