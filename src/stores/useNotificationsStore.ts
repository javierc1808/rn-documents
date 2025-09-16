import { faker } from "@faker-js/faker";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Storage } from "@/src/services/storage";

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
  scrollToNotificationId: string | null;
  totalItemsUnread: () => number;
  add: (
    n: Omit<Notification, "id" | "read"> & { id?: string; read?: boolean },
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
  setScrollToNotification: (id: string | null) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      scrollToNotificationId: null,
      totalItemsUnread: () => {
        return get().items.filter((it) => !it.read).length;
      },
      add: (n) => {
        if (get().items.find((it) => it.documentId === n.documentId)) {
          return get().items;
        }

        if (get().items.length >= 150) {
          set((s) => ({
            items: [
              { id: n.id || faker.string.uuid(), read: n.read || false, ...n },
              ...s.items.slice(0, 149),
            ],
          }));
          return;
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
          items: s.items.map((it) =>
            it.id === id ? { ...it, read: true } : it,
          ),
        })),
      markAllRead: () =>
        set((s) => ({ items: s.items.map((it) => ({ ...it, read: true })) })),
      clear: () => set({ items: [] }),
      setScrollToNotification: (id) => set({ scrollToNotificationId: id }),
    }),
    {
      name: "notifications-store-v1",
      storage: createJSONStorage(Storage),
      partialize: (state) => ({
        items: state.items,
      }),
      version: 1,
    },
  ),
);
