import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseApp } from '../firebase';

const functions = getFunctions(firebaseApp);

export const sendNotificationNow = async (payload: {
  title: string;
  message: string;
  channel: string;
  audience: string;
}) => {
  const callable = httpsCallable(functions, 'sendNotification');
  return callable(payload);
};
