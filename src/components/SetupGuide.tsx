import { useState } from "react";

const steps = [
  {
    num: 1,
    title: "Зарегистрируйся на Firebase",
    color: "from-blue-500 to-blue-600",
    icon: "🌐",
    actions: [
      { text: "Открой сайт:", link: "https://firebase.google.com", label: "firebase.google.com" },
      { text: 'Нажми большую синюю кнопку "Get started" (Начать)', link: null, label: null },
      { text: "Войди через свой Google аккаунт (Gmail)", link: null, label: null },
    ],
  },
  {
    num: 2,
    title: "Создай новый проект",
    color: "from-purple-500 to-purple-600",
    icon: "📁",
    actions: [
      { text: 'Нажми "+ Add project" (Добавить проект)', link: null, label: null },
      { text: 'Введи название, например: "moi-messenger"', link: null, label: null },
      { text: 'Нажми "Continue" → отключи Google Analytics → нажми "Create project"', link: null, label: null },
      { text: 'Жди ~30 секунд и нажми "Continue"', link: null, label: null },
    ],
  },
  {
    num: 3,
    title: "Настрой базу данных Firestore",
    color: "from-green-500 to-green-600",
    icon: "🗄️",
    actions: [
      { text: 'В левом меню нажми "Firestore Database"', link: null, label: null },
      { text: 'Нажми "Create database"', link: null, label: null },
      { text: 'Выбери "Start in test mode" → нажми "Next"', link: null, label: null },
      { text: 'Выбери регион "eur3 (europe-west)" → нажми "Enable"', link: null, label: null },
    ],
  },
  {
    num: 4,
    title: "Включи вход по Email",
    color: "from-yellow-500 to-orange-500",
    icon: "🔑",
    actions: [
      { text: 'В левом меню нажми "Authentication"', link: null, label: null },
      { text: 'Нажми "Get started"', link: null, label: null },
      { text: 'Нажми на "Email/Password"', link: null, label: null },
      { text: 'Включи первый переключатель "Enable" → нажми "Save"', link: null, label: null },
    ],
  },
  {
    num: 5,
    title: "Получи код подключения",
    color: "from-red-500 to-pink-500",
    icon: "⚙️",
    actions: [
      { text: 'Нажми на шестерёнку ⚙️ рядом с "Project Overview" → "Project settings"', link: null, label: null },
      { text: 'Прокрути вниз, найди раздел "Your apps" → нажми иконку </> (Web)', link: null, label: null },
      { text: 'Введи имя приложения (любое) → нажми "Register app"', link: null, label: null },
      { text: 'Скопируй весь код firebaseConfig — он выглядит как на картинке ниже', link: null, label: null },
    ],
  },
  {
    num: 6,
    title: "Вставь код в файл firebase.ts",
    color: "from-indigo-500 to-blue-500",
    icon: "📝",
    actions: [
      { text: 'Открой файл src/firebase.ts в своём редакторе кода', link: null, label: null },
      { text: 'Замени строки "ВСТАВЬ_СЮДА" на свои значения из Firebase', link: null, label: null },
      { text: 'Сохрани файл', link: null, label: null },
    ],
  },
  {
    num: 7,
    title: "Задай правила безопасности Firestore",
    color: "from-teal-500 to-cyan-500",
    icon: "🛡️",
    actions: [
      { text: 'Зайди в Firestore Database → вкладка "Rules"', link: null, label: null },
      { text: "Замени всё содержимое на код ниже и нажми Publish", link: null, label: null },
    ],
    codeBlock: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    match /rooms/{roomId} {
      allow read, write: if request.auth != null;
    }
  }
}`,
  },
  {
    num: 8,
    title: "Задеплой на Vercel (бесплатный хостинг)",
    color: "from-gray-600 to-gray-800",
    icon: "🚀",
    actions: [
      { text: "Зайди на:", link: "https://github.com", label: "github.com" },
      { text: 'Создай аккаунт → нажми "New repository" → назови "messenger" → Create', link: null, label: null },
      { text: "Установи Git на компьютер если нет:", link: "https://git-scm.com/downloads", label: "git-scm.com/downloads" },
      { text: 'Открой папку проекта → правой кнопкой → "Git Bash Here" (или Terminal)', link: null, label: null },
    ],
    codeBlock: `git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/ТВОЙ_НИК/messenger.git
git push -u origin main`,
  },
  {
    num: 9,
    title: "Подключи Vercel",
    color: "from-slate-500 to-slate-700",
    icon: "✅",
    actions: [
      { text: "Зайди на:", link: "https://vercel.com", label: "vercel.com" },
      { text: 'Нажми "Sign Up" → войди через GitHub', link: null, label: null },
      { text: 'Нажми "New Project" → выбери репозиторий "messenger"', link: null, label: null },
      { text: 'Нажми "Deploy" — через минуту получишь ссылку вида yourapp.vercel.app', link: null, label: null },
      { text: "Эту ссылку отправь друзьям — они сразу смогут войти! 🎉", link: null, label: null },
    ],
  },
];

export default function SetupGuide() {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-3xl font-bold text-white mb-2">Мой Мессенджер</h1>
          <p className="text-slate-400 text-sm">
            Следуй инструкции ниже — займёт ~15 минут, и мессенджер заработает для всех!
          </p>
          <div className="mt-4 bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-3">
            <p className="text-yellow-300 text-sm font-medium">
              ⚡ После настройки Firebase — обнови страницу и приложение заработает!
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/30 transition-colors"
                onClick={() => setOpenStep(openStep === step.num ? null : step.num)}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {step.num}
                </div>
                <div className="flex-1">
                  <span className="text-lg mr-2">{step.icon}</span>
                  <span className="text-white font-semibold">{step.title}</span>
                </div>
                <span className="text-slate-400 text-xl">{openStep === step.num ? "▲" : "▼"}</span>
              </button>

              {openStep === step.num && (
                <div className="px-4 pb-4">
                  <div className="ml-14 space-y-3">
                    {step.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-500 text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
                        <p className="text-slate-300 text-sm">
                          {action.text}{" "}
                          {action.link && (
                            <a
                              href={action.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline hover:text-blue-300"
                            >
                              {action.label}
                            </a>
                          )}
                        </p>
                      </div>
                    ))}

                    {step.codeBlock && (
                      <div className="relative mt-3">
                        <pre className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-green-400 text-xs overflow-x-auto whitespace-pre-wrap">
                          {step.codeBlock}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(step.codeBlock!, `step-${step.num}`)}
                          className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                        >
                          {copied === `step-${step.num}` ? "✅ Скопировано!" : "📋 Копировать"}
                        </button>
                      </div>
                    )}

                    {step.num === 5 && (
                      <div className="mt-3 bg-slate-900 border border-slate-600 rounded-xl p-4">
                        <p className="text-slate-400 text-xs mb-2">Пример кода который ты увидишь на Firebase:</p>
                        <pre className="text-yellow-300 text-xs overflow-x-auto">{`const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXX",
  authDomain: "moi-messenger.firebaseapp.com",
  projectId: "moi-messenger",
  storageBucket: "moi-messenger.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};`}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-green-500/20 border border-green-500/40 rounded-2xl p-4 text-center">
          <p className="text-green-300 font-semibold text-lg">🎉 Готово!</p>
          <p className="text-green-400/80 text-sm mt-1">
            После всех шагов перезагрузи страницу — появится экран входа!
          </p>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4 pb-6">Мессенджер работает бесплатно для до 50 000 чтений/день</p>
      </div>
    </div>
  );
}
