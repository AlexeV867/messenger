import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (name.trim().length < 2) {
          setError("Имя должно быть не короче 2 символов");
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
      }
    } catch (err: any) {
      const codes: Record<string, string> = {
        "auth/email-already-in-use": "Этот email уже используется",
        "auth/invalid-email": "Неверный формат email",
        "auth/weak-password": "Пароль слишком короткий (минимум 6 символов)",
        "auth/user-not-found": "Пользователь не найден",
        "auth/wrong-password": "Неверный пароль",
        "auth/invalid-credential": "Неверный email или пароль",
        "auth/too-many-requests": "Слишком много попыток, подожди немного",
      };
      setError(codes[err.code] || "Произошла ошибка: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">💬</div>
          <h1 className="text-3xl font-bold text-white">Мессенджер</h1>
          <p className="text-slate-400 mt-1 text-sm">Общайся с друзьями по всей России</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-900/50 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isLogin
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                !isLogin
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-slate-300 text-sm mb-1.5 font-medium">Твоё имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как тебя зовут?"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-sm mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
                className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-1.5 font-medium">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95"
            >
              {loading ? "⏳ Загрузка..." : isLogin ? "🚀 Войти" : "✅ Создать аккаунт"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-4">
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {isLogin ? "Зарегистрируйся" : "Войди"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
