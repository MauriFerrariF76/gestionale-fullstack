import pool from '../config/database';
import { AuditLog } from '../models/AuditLog';

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
  const res = await pool.query(
    `INSERT INTO audit_logs (user_id, action, ip, details)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [log.userId, log.action, log.ip, log.details]
  );
  const row = res.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    ip: row.ip,
    timestamp: row.timestamp,
    details: row.details,
  };
}

export async function getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
  const res = await pool.query('SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY timestamp DESC', [userId]);
  return res.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    action: row.action,
    ip: row.ip,
    timestamp: row.timestamp,
    details: row.details,
  }));
} 