import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logAudit } from './audit';

export const createAdmissionApplication = async (payload: {
  schoolName: string;
  city: string;
  board: string;
  contactName: string;
  contactRole: string;
  email: string;
  students?: string;
  grades?: string;
  phone?: string;
  goLive?: string;
  notes?: string;
}) => {
  const ref = await addDoc(collection(db, 'admissions'), {
    ...payload,
    status: 'New',
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'admission', entityId: ref.id, metadata: { schoolName: payload.schoolName } });
  return ref;
};

export const updateAdmissionStatus = async (id: string, status: string) => {
  await updateDoc(doc(db, 'admissions', id), { status });
  return logAudit({ action: 'status_update', entity: 'admission', entityId: id, metadata: { status } });
};

export const createUserInvite = async (payload: {
  name: string;
  email: string;
  role: string;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'user_invites'), {
    ...payload,
    status: 'Invited',
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'invite', entity: 'user_invite', entityId: ref.id, metadata: { email: payload.email, role: payload.role } });
  return ref;
};

export const updateInviteStatus = async (id: string, status: string) => {
  await updateDoc(doc(db, 'user_invites', id), { status });
  return logAudit({ action: 'status_update', entity: 'user_invite', entityId: id, metadata: { status } });
};

export const createClass = async (payload: {
  grade: string;
  section: string;
  teacher: string;
  room: string;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'classes'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'class', entityId: ref.id, metadata: { grade: payload.grade } });
  return ref;
};

export const recordAttendance = async (payload: {
  classId: string;
  date: string;
  present: number;
  absent: number;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'attendance_records'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'attendance', entityId: ref.id, metadata: { classId: payload.classId } });
  return ref;
};

export const createExam = async (payload: {
  title: string;
  subject: string;
  date: string;
  grade: string;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'exams'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'exam', entityId: ref.id, metadata: { title: payload.title } });
  return ref;
};

import { ContactMessage, BusRoute, Trip, BusStop } from '../types';

export const createContactMessage = async (payload: Omit<ContactMessage, 'createdAt' | 'status'>) => {
  const ref = await addDoc(collection(db, 'contacts'), {
    ...payload,
    status: 'New',
    createdAt: serverTimestamp(),
  });
  // No audit log needed for public contact form usually, but can add if needed
  return ref;
};

export const createRoute = async (payload: Omit<BusRoute, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, 'routes'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'route', entityId: ref.id, metadata: { name: payload.name } });
  return ref;
};

export const startTrip = async (payload: Omit<Trip, 'id' | 'lastUpdated'>) => {
  const ref = await addDoc(collection(db, 'trips'), {
    ...payload,
    lastUpdated: serverTimestamp(),
  });
  return ref;
};

export const updateTripStop = async (tripId: string, currentStopIndex: number) => {
  await updateDoc(doc(db, 'trips', tripId), {
    currentStopIndex,
    lastUpdated: serverTimestamp(),
  });
};

export const completeTrip = async (tripId: string) => {
  await updateDoc(doc(db, 'trips', tripId), {
    status: 'completed',
    lastUpdated: serverTimestamp(),
  });
};

export const createInventoryItem = async (payload: {
  name: string;
  category: string;
  quantity: number;
  location: string;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'inventory'), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'inventory', entityId: ref.id, metadata: { name: payload.name } });
  return ref;
};

export const createNotification = async (payload: {
  title: string;
  message: string;
  channel: string;
  audience: string;
  schoolId?: string;
}) => {
  const ref = await addDoc(collection(db, 'notifications'), {
    ...payload,
    status: 'Scheduled',
    createdAt: serverTimestamp(),
  });
  logAudit({ action: 'create', entity: 'notification', entityId: ref.id, metadata: { title: payload.title } });
  return ref;
};

export const updateRecord = async (path: string, id: string, data: Record<string, any>) => {
  await updateDoc(doc(db, path, id), data);
  return logAudit({ action: 'update', entity: path, entityId: id, metadata: { fields: Object.keys(data) } });
};

export const deleteRecord = async (path: string, id: string) => {
  await deleteDoc(doc(db, path, id));
  return logAudit({ action: 'delete', entity: path, entityId: id });
};

export const seedDemoProfile = async (uid: string) => {
  return setDoc(doc(db, 'users', uid), {
    uid,
    role: 'super_admin',
    displayName: 'Demo Admin',
    email: 'demo@schools24.in',
    createdAt: serverTimestamp(),
  });
};
