import { ref } from "vue";
import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../utils/firebase";

export const useUserStore = defineStore("user", () => {
  const userId = ref(null);
  const userEmail = ref(null);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      userEmail.value = user.email;
    } else {
      userId.value = null;
      userEmail.value = null;
    }
  });

  return {
    userId,
    userEmail,
  };
});
