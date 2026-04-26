import admin from '../config/firebase.js'

const sendPush = async (token, title, body, data = {}) => {
  const message = {
    token,
    notification: { title, body },
    data,
    android: { priority: 'high' },
  };

  return admin.messaging().send(message);
};

export { sendPush };