import speakeasy from 'speakeasy';

export function generateMfaSecret(): { ascii: string; base32: string; otpauth_url: string } {
  return speakeasy.generateSecret({ length: 20 });
}

export function verifyMfaToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
} 