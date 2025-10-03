const {onCall, HttpsError} = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendYoBro = onCall(async (request, context) => {
  const {toUserId, title, body} = request.data || {};

  if (!toUserId || !title || !body) {
    throw new HttpsError('invalid-argument', 'Missing parameters');
  }

  try {
    const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(toUserId)
        .collection('ProfileInfo')
        .doc('main')
        .get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const {fcmTokens = []} = userDoc.data();

    if (!fcmTokens.length) {
      throw new HttpsError('failed-precondition', 'User has no FCM tokens');
    }

    const message = {
      notification: {title, body},
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // Проверяем результат
    const invalidTokens = [];
    response.responses.forEach((res, idx) => {
      if (!res.success) {
        const errorCode = res.error?.code;
        if (errorCode === 'messaging/registration-token-not-registered') {
          invalidTokens.push(fcmTokens[idx]);
        }
      }
    });

    // Чистим Firestore от битых токенов
    if (invalidTokens.length > 0) {
      await admin
          .firestore()
          .collection('users')
          .doc(toUserId)
          .collection('ProfileInfo')
          .doc('main')
          .update({
            fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
          });
      logger.warn('🗑️ Удалены невалидные токены', {invalidTokens});
    }

    return {success: true, response};
  } catch (error) {
    logger.error('Ошибка при отправке уведомления', {error});
    throw new HttpsError('internal', 'Failed to send notification');
  }
});
