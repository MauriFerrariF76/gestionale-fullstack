export type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  ip: string;
  timestamp: Date;
  details?: string;
}; 