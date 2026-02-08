import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const logAudit = async (payload: {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
}) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Silent fail for audit logging
  }
};
