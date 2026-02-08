const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

admin.initializeApp();

const getTwilioClient = () => {
  const sid = functions.config().twilio?.sid;
  const token = functions.config().twilio?.token;
  if (!sid || !token) return null;
  return twilio(sid, token);
};

const sendEmail = async ({ to, subject, text }) => {
  const apiKey = functions.config().sendgrid?.key;
  const from = functions.config().sendgrid?.from;
  if (!apiKey || !from) return;
  sgMail.setApiKey(apiKey);
  await sgMail.send({ to, from, subject, text });
};

const sendSms = async ({ to, body }) => {
  const client = getTwilioClient();
  const from = functions.config().twilio?.from;
  if (!client || !from) return;
  await client.messages.create({ to, from, body });
};

const sendPush = async ({ topic, title, body }) => {
  await admin.messaging().send({
    topic,
    notification: { title, body },
  });
};

const requireRole = async (uid, allowed) => {
  const snap = await admin.firestore().collection('users').doc(uid).get();
  if (!snap.exists) return false;
  const role = snap.data().role;
  return allowed.includes(role);
};

const getRequesterProfile = async (uid) => {
  const snap = await admin.firestore().collection('users').doc(uid).get();
  if (!snap.exists) return null;
  return snap.data();
};

exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  }
  const { title, message, channel, audience } = data || {};
  if (!title || !message || !channel) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing fields');
  }

  const topic = audience ? String(audience).toLowerCase().replace(/\s+/g, '_') : 'all_users';

  if (channel === 'Email') {
    await sendEmail({ to: functions.config().sendgrid?.test_to || 'test@example.com', subject: title, text: message });
  }
  if (channel === 'SMS') {
    await sendSms({ to: functions.config().twilio?.test_to || '+10000000000', body: message });
  }
  if (channel === 'Push') {
    await sendPush({ topic, title, body: message });
  }

  return { ok: true };
});

exports.createUserWithDefaultPassword = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required');
  }

  const { name, email, role, schoolId } = data || {};
  if (!email || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing fields');
  }

  const requester = await getRequesterProfile(context.auth.uid);
  if (!requester) {
    throw new functions.https.HttpsError('permission-denied', 'Requester profile not found');
  }

  if (role === 'super_admin') {
    if (requester.role !== 'super_admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only Super Admin can create Super Admin');
    }
  } else if (!['admin', 'super_admin'].includes(requester.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Not allowed');
  }

  let assignedSchoolId = schoolId || '';

  if (requester.role === 'admin') {
    const requesterSchoolId = requester.schoolId;
    if (requesterSchoolId) {
      assignedSchoolId = requesterSchoolId;
    }
    if (requesterSchoolId && schoolId && requesterSchoolId !== schoolId) {
      throw new functions.https.HttpsError('permission-denied', 'Admins can only create users within their school');
    }
    if (requesterSchoolId) {
      const schoolSnap = await admin.firestore().collection('schools').doc(requesterSchoolId).get();
      const locks = schoolSnap.exists ? schoolSnap.data().locks : null;
      if (locks?.users) {
        throw new functions.https.HttpsError('permission-denied', 'User creation is locked for this school');
      }
    }
  }

  const userRecord = await admin.auth().createUser({
    email,
    password: 'qwe123',
    displayName: name || email,
  });

  await admin.firestore().collection('users').doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    displayName: name || email,
    role,
    schoolId: assignedSchoolId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { uid: userRecord.uid, tempPassword: 'qwe123' };
});
