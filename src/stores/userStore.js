import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebaseApp from "../utils/firebase";

export const useUserStore = defineStore("user", () => {
  const userId = ref(null);
  const userEmail = ref(null);
  const userName = ref("");

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const fetchUserProfile = async () => {
    if (!userId.value) {
      return;
    }

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

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userId.value = user.uid;
      userEmail.value = user.email;
      userName.value = user.userName;
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
    fetchUserProfile,
    updateUserProfile,
    lotOut,
  };
});
