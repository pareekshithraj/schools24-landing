import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../firebase';

/**
 * Creates a user with a default password directly from the client.
 * USES A SECONDARY APP INSTANCE to avoid signing out the current user.
 * 
 * NOTE: This is a client-side workaround because we do not have Cloud Functions deployed.
 * In a real production app, this should be a collection listener trigger or a Callable Function.
 */
export const createUserWithDefaultPassword = async (payload: {
  name: string;
  email: string;
  role: string;
  schoolId?: string;
  defaultPassword?: string;
}) => {
  // 1. Initialize a secondary app to handle the new auth session
  // This prevents the main app (Super Admin) from being logged out
  const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
  const secondaryAuth = getAuth(secondaryApp);
  const secondaryDb = getFirestore(secondaryApp);

  const password = payload.defaultPassword || 'qwe123';

  try {
    // 2. Create the user in the secondary app
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, payload.email, password);
    const user = userCredential.user;

    // 3. Update Auth Profile
    await updateProfile(user, { displayName: payload.name });

    // 4. Create User Document in Firestore
    // We can use the secondary DB or the primary DB (both point to same project).
    // Using secondary for consistency with the auth user.
    await setDoc(doc(secondaryDb, 'users', user.uid), {
      uid: user.uid,
      email: payload.email,
      displayName: payload.name,
      role: payload.role,
      schoolId: payload.schoolId || null,
      createdAt: serverTimestamp(),
      createdBy: 'super_admin_manual', // Audit trail
      mustChangePassword: true,
    });

    // 5. Sign out the secondary user so the session doesn't linger
    await signOut(secondaryAuth);

    return {
      data: {
        uid: user.uid,
        email: user.email,
        message: 'User created successfully via secondary app.'
      }
    };

  } catch (error: any) {
    console.error('Error creating user via secondary app:', error);
    throw error;
  } finally {
    // 6. Delete the secondary app to clean up resources
    await deleteApp(secondaryApp);
  }
};
