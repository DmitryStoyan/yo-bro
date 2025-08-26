import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA4GvD95cepNp3WDqpnSmUIx_vspSAma-8",
  authDomain: "yo-bro-1d8af.firebaseapp.com",
  projectId: "yo-bro-1d8af",
  storageBucket: "yo-bro-1d8af.appspot.com",
  messagingSenderId: "783564485342",
  appId: "1:783564485342:web:d8db20218c261876d6884f",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions, httpsCallable };
export default app;
