import jwt, { SignOptions, StringValue } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const privateKey: string = fs.readFileSync(path.join(__dirname, '../../config/keys/jwtRS256.key'), 'utf8');
const publicKey: string = fs.readFileSync(path.join(__dirname, '../../config/keys/jwtRS256.key.pub'), 'utf8');

export function signJwt(payload: object, expiresIn: StringValue | number = '15m'): string {
  const options: SignOptions = { algorithm: 'RS256', expiresIn };
  return jwt.sign(payload, privateKey, options);
}

export function verifyJwt(token: string): any {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
} 