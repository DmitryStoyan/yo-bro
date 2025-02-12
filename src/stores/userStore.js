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
} from "firebase/firestore";
import firebaseApp from "../utils/firebase";

export const useUserStore = defineStore("user", () => {
  const userId = ref(null);
  const userEmail = ref(null);
  const userName = ref("");
  const searchResults = ref([]);

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
        await updateDoc(docRef, { userName: newName });
      } else {
        await setDoc(docRef, {
          userName: newName,
          friends: [],
        });
      }
      userName.value = newName;
    } catch (error) {
      console.error("Ошибка при обновлении профиля: ", error);
    }
  };

  const lotOut = async () => {
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
      const profilesQuery = query(
        collectionGroup(db, "ProfileInfo"),
        where("userName", ">=", searchTerm),
        where("userName", "<=", searchTerm + "\uf8ff")
      );
      const listDocs = await getDocs(profilesQuery);
      searchResults.value = listDocs.docs.map((doc) => {
        const userData = doc.data();
        const userId = doc.id;
        const userObject = { id: userId, ...userData };

        return userObject;
      });
    } catch (error) {
      console.error(error);
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

  return {
    userId,
    userEmail,
    userName,
    searchResults,
    fetchUserProfile,
    updateUserProfile,
    lotOut,
    getAllUsers,
    searchUsers,
  };
});
