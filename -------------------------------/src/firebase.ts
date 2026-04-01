import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ============================================================
// СЮДА ВСТАВЛЯЕШЬ СВОИ ДАННЫЕ ИЗ FIREBASE (шаг 4 инструкции)
// ============================================================
const firebaseConfig = {
  apiKey: "moimessenger-2ce13.firebaseapp.com",
  authDomain: "https://moimessenger-2ce13-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moimessenger-2ce13",
  storageBucket: "moimessenger-2ce13.firebasestorage.app",
  messagingSenderId: "249843589582",
  appId: "1:249843589582:web:aa0ecf1b6baf84b35bcb9f",
};
// ============================================================

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
