import { functions, httpsCallable } from "./firebase";

/**
 * Вызывает Cloud Function sendYoBro и отправляет уведомление другу
 * @param {string} toUserId - ID пользователя, которому отправляется "Yo Bro"
 * @param {string} title - Заголовок уведомления
 * @param {string} body - Текст уведомления
 * @returns {Promise}
 */
export async function sendYoBro(
  toUserId,
  title = "Yo Bro 👋",
  body = "Тебе прилетело ЙО"
) {
  const sendYoBroFunction = httpsCallable(functions, "sendYoBro");
  const payload = { toUserId, title, body };
  console.log("Sending payload:", payload);
  try {
    const result = await sendYoBroFunction(payload);
    console.log("Уведомление отправлено:", result.data);
    return result.data;
  } catch (error) {
    console.error('Ошибка при отправке "Yo Bro":', error);
    throw error;
  }
}
