import { ref } from "vue";
import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  collectionGroup,
  where,
  deleteDoc,
  collection,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import firebaseApp from "../utils/firebase";
import { requestFCMPermission } from "@/utils/messaging";

export const useUserStore = defineStore("user", () => {
  const userId = ref(null);
  const userEmail = ref(null);
  const userName = ref("");
  const searchResults = ref([]);
  const incomingRequests = ref([]);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const fetchUserProfile = async () => {
    if (!userId.value) return;
    const docRef = doc(db, `users/${userId.value}/ProfileInfo`, "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      userName.value = docSnap.data().userName || "Имя не указано";
    } else {
      userName.value = "Имя не указано!";
    }
  };

  const updateUserProfile = async (newName) => {
    if (!userId.value) return;
    const docRef = doc(db, `users/${userId.value}/ProfileInfo`, "main");

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          userName: newName,
          userNameLower: newName.toLowerCase(),
        });
      } else {
        await setDoc(docRef, {
          userName: newName,
          userNameLower: newName.toLowerCase(),
          friends: [],
        });
      }
      userName.value = newName;
    } catch (error) {
      console.error("Ошибка при обновлении профиля: ", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      userId.value = null;
      userEmail.value = null;
      userName.value = "";
      console.log("Пользователь вышел из системы");
    } catch (error) {
      console.error("Ошибка при выходе", error);
    }
  };

  const getAllUsers = async () => {
    try {
      console.log("Запрашиваем всех пользователей...");
      const profilesQuery = query(collectionGroup(db, "ProfileInfo"));
      const listDocs = await getDocs(profilesQuery);
      console.log("Найдено пользователей:", listDocs.size);
      listDocs.forEach((doc) => {
        const data = doc.data();
        console.log("Пользователь:", doc.id, "=>", doc.data());
        console.log(data.userName);
      });
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      console.log("Поиск по userName...");
      if (!searchTerm || searchTerm.trim() === "") {
        console.warn("Поисковый запрос пустой!");
        searchResults.value = [];
        return;
      }

      const searchTermLower = searchTerm.toLowerCase();

      const profilesQuery = query(
        collectionGroup(db, "ProfileInfo"),
        where("userNameLower", ">=", searchTermLower),
        where("userNameLower", "<=", searchTermLower + "\uf8ff")
      );
      const listDocs = await getDocs(profilesQuery);
      searchResults.value = listDocs.docs.map((doc) => {
        const userData = doc.data();
        const userId = doc.ref.parent.parent.id;
        const userObject = { id: userId, ...userData };

        return userObject;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendFriendRequest = async (receiverId, receiverName) => {
    if (!userId.value) return;

    const requestRef = doc(db, `friendRequests/${userId.value}_${receiverId}`);

    try {
      const requestSnap = await getDoc(requestRef);

      if (requestSnap.exists()) {
        console.warn("Запрос уже отправлен");
        return;
      }

      await setDoc(requestRef, {
        fromUserId: userId.value,
        fromUserName: userName.value,
        toUserId: receiverId,
        toUserName: receiverName,
        status: "pending",
        timestamp: new Date(),
      });

      console.log(`Запрос в друзья отправлен пользователю ${receiverName}`);
    } catch (error) {
      console.error("Ошибка при отправке запроса в друзья:", error);
    }
  };

  const cancelFriendRequest = async (receiverId) => {
    const requestId = `${userId.value}_${receiverId}`;
    const requestRef = doc(db, "friendRequests", requestId);
    try {
      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        await deleteDoc(requestRef);
        console.log("Запрос в друзья отменен");
      }
    } catch (error) {
      console.error("Ошибка при отмене запроса в друзья:", error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const friendQuery = query(
        collection(db, "friendRequests"),
        where("toUserId", "==", userId.value)
      );

      onSnapshot(friendQuery, (querySnapshot) => {
        incomingRequests.value = [];

        querySnapshot.forEach((doc) => {
          incomingRequests.value.push({
            id: doc.id,
            fromUserName: doc.data().fromUserName,
          });
        });

        console.log("Обновленные запросы:", incomingRequests.value);
      });
    } catch (error) {
      console.error("Ошибка при получении запросов в друзья:", error);
    }
  };

  const declineFriendRequest = async (requestId) => {
    const requestRef = doc(db, "friendRequests", requestId);
    try {
      const requestSnap = await getDoc(requestRef);
      if (requestSnap.exists()) {
        await deleteDoc(requestRef);
        console.log("Запрос в друзья отклонен");
      }
    } catch (error) {
      console.error("Ошибка при отклонении запроса в друзья:", error);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    if (!userId.value) return;

    const requestRef = doc(db, "friendRequests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (requestSnap.exists()) {
      const requestData = requestSnap.data();
      const { fromUserId, toUserId } = requestData;

      const fromUserRef = doc(db, "users", fromUserId, "ProfileInfo", "main");
      const toUserRef = doc(db, "users", toUserId, "ProfileInfo", "main");

      await updateDoc(fromUserRef, {
        friends: arrayUnion(toUserId),
      });

      await updateDoc(toUserRef, {
        friends: arrayUnion(fromUserId),
      });

      await deleteDoc(requestRef);

      console.log("Запрос принят, пользователи добавлены в друзья");
    } else {
      console.error("Запрос не найден");
    }
  };

  const getFriends = async () => {
    if (!userId.value) return [];

    try {
      const userRef = doc(db, "users", userId.value, "ProfileInfo", "main");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const friendIds = userData.friends || [];

        const friends = [];
        for (const friendId of friendIds) {
          const friendRef = doc(db, "users", friendId, "ProfileInfo", "main");
          const friendSnap = await getDoc(friendRef);
          if (friendSnap.exists()) {
            const friendData = friendSnap.data();
            friends.push({ id: friendId, name: friendData.userName });
          }
        }

        return friends;
      } else {
        console.log("Пользователь не найден");
        return [];
      }
    } catch (error) {
      console.error("Ошибка при получении друзей:", error);
      return [];
    }
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      userEmail.value = user.email;
      await fetchUserProfile();
    } else {
      userId.value = null;
      userEmail.value = null;
      userName.value = "";
    }
  });

  const saveFCMToken = async (uid, token) => {
    if (!uid || !token) return;
    try {
      const userRef = doc(db, `users/${uid}/ProfileInfo`, "main");
      await updateDoc(userRef, {
        fcmToken: token,
      });
      console.log("FCM-токен сохранён в Firestore:", token);
    } catch (error) {
      console.error("Ошибка при сохранении FCM-токена:", error);
    }
  };

  return {
    userId,
    userEmail,
    userName,
    searchResults,
    incomingRequests,
    fetchUserProfile,
    updateUserProfile,
    logOut,
    getAllUsers,
    searchUsers,
    sendFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    declineFriendRequest,
    acceptFriendRequest,
    getFriends,
    saveFCMToken,
  };
});
