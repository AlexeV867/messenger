export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: any;
  room: string;
}

export interface Room {
  id: string;
  name: string;
  emoji: string;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
}
