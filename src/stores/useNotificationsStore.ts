import { faker } from "@faker-js/faker";
import { create } from "zustand";

interface Notification {
  id: string;
  documentId: string;
  documentTitle: string;
  type: string;
  createdAt: string;
  userName: string;
  userId: string;
  read: boolean;
}

interface NotificationsState {
  items: Notification[];
  add: (
    n: Omit<Notification, "id" | "read"> & { id?: string; read?: boolean }
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  add: (n) => {
    if (get().items.find((it) => it.documentId === n.documentId)) {
      return get().items;
    }

    set((s) => ({
      items: [
        { id: n.id || faker.string.uuid(), read: n.read || false, ...n },
        ...s.items,
      ],
    }));
  },
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((it) => (it.id === id ? { ...it, read: true } : it)),
    })),
  markAllRead: () =>
    set((s) => ({ items: s.items.map((it) => ({ ...it, read: true })) })),
  clear: () => set({ items: [] }),
}));
