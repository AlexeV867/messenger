import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { Message, Room, User } from "../types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const ROOMS: Room[] = [
  { id: "general", name: "Общий", emoji: "💬" },
  { id: "games", name: "Игры", emoji: "🎮" },
  { id: "music", name: "Музыка", emoji: "🎵" },
  { id: "movies", name: "Кино", emoji: "🎬" },
  { id: "random", name: "Оффтоп", emoji: "🎲" },
];

interface ChatProps {
  user: User;
}

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Room>(ROOMS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "messages"),
      where("room", "==", currentRoom.id),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsub();
  }, [currentRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text.trim();
    setText("");
    try {
      await addDoc(collection(db, "messages"), {
        text: msgText,
        userId: user.uid,
        userName: user.displayName || "Аноним",
        createdAt: serverTimestamp(),
        room: currentRoom.id,
      });
    } catch (err) {
      console.error(err);
    }
    inputRef.current?.focus();
  };

  const formatTime = (ts: any) => {
    if (!ts) return "";
    try {
      return format(ts.toDate(), "HH:mm", { locale: ru });
    } catch {
      return "";
    }
  };

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?";

  const getColor = (uid: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500",
      "bg-pink-500", "bg-yellow-500", "bg-red-500",
      "bg-indigo-500", "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < uid.length; i++) hash += uid.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const isMyMsg = (msg: Message) => msg.userId === user.uid;

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  messages.forEach((msg) => {
    let dateLabel = "";
    try {
      dateLabel = format(msg.createdAt?.toDate(), "d MMMM", { locale: ru });
    } catch {
      dateLabel = "Сегодня";
    }
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateLabel) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateLabel, msgs: [msg] });
    }
  });

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700/50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* App title */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Мессенджер</h1>
              <p className="text-slate-500 text-xs">Привет, {user.displayName}! 👋</p>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 px-2">Чаты</p>
          <div className="space-y-1">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => { setCurrentRoom(room); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  currentRoom.id === room.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                }`}
              >
                <span className="text-xl">{room.emoji}</span>
                <span className="font-medium text-sm">{room.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User info + logout */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${getColor(user.uid)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {getInitial(user.displayName || "?")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
            <button
              onClick={() => signOut(auth)}
              title="Выйти"
              className="text-slate-500 hover:text-red-400 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-2xl">{currentRoom.emoji}</span>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">{currentRoom.name}</h2>
            <p className="text-slate-500 text-xs">
              {loading ? "Загрузка..." : `${messages.length} сообщений`}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500 text-center">
                <div className="text-4xl mb-2 animate-spin">⏳</div>
                <p>Загружаем сообщения...</p>
              </div>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl mb-3">{currentRoom.emoji}</div>
                <p className="text-slate-400 font-medium">Пока пусто</p>
                <p className="text-slate-600 text-sm mt-1">Напиши первым!</p>
              </div>
            </div>
          )}

          {!loading && groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-700/50" />
                <span className="text-slate-500 text-xs px-2">{group.date}</span>
                <div className="flex-1 h-px bg-slate-700/50" />
              </div>

              {group.msgs.map((msg, idx) => {
                const mine = isMyMsg(msg);
                const prevMsg = idx > 0 ? group.msgs[idx - 1] : null;
                const showName = !prevMsg || prevMsg.userId !== msg.userId;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 mb-1 ${mine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {!mine && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${getColor(msg.userId)} ${!showName ? "opacity-0" : ""}`}>
                        {getInitial(msg.userName)}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                      {showName && !mine && (
                        <span className="text-xs text-slate-400 mb-1 ml-1">{msg.userName}</span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm break-words ${
                          mine
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-slate-700 text-slate-100 rounded-bl-md"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-slate-600 text-xs mt-1 mx-1">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-slate-800/80 backdrop-blur border-t border-slate-700/50 p-4 flex-shrink-0">
          <form onSubmit={sendMessage} className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Написать в ${currentRoom.name}...`}
              className="flex-1 bg-slate-700/60 border border-slate-600/40 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
              maxLength={1000}
              autoFocus
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg flex-shrink-0"
            >
              <svg className="w-5 h-5 text-white rotate-45 -translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
