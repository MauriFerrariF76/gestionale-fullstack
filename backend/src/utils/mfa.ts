import speakeasy from 'speakeasy';

export function generateMfaSecret(): { ascii: string; base32: string; otpauth_url: string } {
  const secret = speakeasy.generateSecret({ length: 20 });
  return {
    ascii: secret.ascii,
    base32: secret.base32,
    otpauth_url: secret.otpauth_url || ""
  };
}

export function verifyMfaToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
} 