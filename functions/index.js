const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendYoBro = onCall(async (request, context) => {
  logger.info("sendYoBro called", {request});

  // Извлекаем параметры из request.data
  const {toUserId, title, body} = request.data || {};

  if (!toUserId || !title || !body) {
    logger.warn("Missing parameters", {data: request.data});
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  try {
    // Проверяем пользователя по пути /users/{toUserId}/ProfileInfo/main
    const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(toUserId)
        .collection("ProfileInfo")
        .doc("main")
        .get();

    if (!userDoc.exists) {
      logger.warn("User not found", {toUserId});
      throw new HttpsError("not-found", "User not found");
    }

    const token =
      userDoc.data().fcmToken ||
      (userDoc.data().fcmTokens && userDoc.data().fcmTokens[0]);

    if (!token) {
      logger.warn("User does not have an FCM token", {toUserId});
      throw new HttpsError(
          "invalid-argument",
          "User does not have an FCM token",
      );
    }

    const message = {
      notification: {title, body},
      token,
    };

    const response = await admin.messaging().send(message);
    logger.info("FCM message sent successfully", {response});
    return {success: true, response};
  } catch (error) {
    logger.error("Error sending notification", {error});
    throw new HttpsError("internal", "Failed to send notification");
  }
});
