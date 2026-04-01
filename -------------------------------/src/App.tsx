import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { User } from "./types";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import SetupGuide from "./components/SetupGuide";

// Проверяем — вставлены ли реальные данные Firebase
const isFirebaseConfigured = () => {
  try {
    const app = auth.app;
    const config = app.options;
    return (
      config.apiKey &&
      config.apiKey !== "ВСТАВЬ_СЮДА" &&
      config.projectId &&
      config.projectId !== "ВСТАВЬ_СЮДА"
    );
  } catch {
    return false;
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [configured]);

  // Firebase не настроен — показываем инструкцию
  if (!configured) {
    return <SetupGuide />;
  }

  // Загрузка
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">💬</div>
          <p className="text-slate-400 text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Не авторизован
  if (!user) {
    return <Auth />;
  }

  // Авторизован
  return <Chat user={user} />;
}
