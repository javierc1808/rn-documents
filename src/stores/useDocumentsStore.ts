import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Document } from "@/src/models/types";
import { Storage } from "@/src/services/storage";

type NetworkStatus = "idle" | "ok" | "error";

type DocumentsState = {
  items: Document[];
  lastSyncAt?: number;
  networkStatus: NetworkStatus;
  errorMessage?: string;
  // hidratar
  hasHydrated: boolean;
  // actions
  setItems: (items: Document[]) => void;
  upsertItems: (items: Document[]) => void;
  setNetworkError: (msg: string) => void;
  clearNetworkError: () => void;
  markHydrated: () => void;
};

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      items: [],
      networkStatus: "idle",
      hasHydrated: false,

      setItems: (items) =>
        set({ items, lastSyncAt: Date.now(), networkStatus: "ok", errorMessage: undefined }),

      upsertItems: (incoming) => {
        const current = get().items;
        const byId = new Map(current.map((it) => [it.id, it]));
        for (const it of incoming) byId.set(it.id, it);
        set({
          items: Array.from(byId.values()),
          lastSyncAt: Date.now(),
          networkStatus: "ok",
          errorMessage: undefined,
        });
      },

      setNetworkError: (msg) => set({ networkStatus: "error", errorMessage: msg }),
      clearNetworkError: () => set({ networkStatus: "ok", errorMessage: undefined }),
      markHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "documents-store-v1",
      storage: createJSONStorage(Storage),
      // marcaremos cuando hidrata
      onRehydrateStorage: () => (state) => {
        // se llama después de rehidratar
        state?.markHydrated();
      },
      // opcional: solo persistir ciertos campos
      partialize: (s) => ({
        items: s.items,
        lastSyncAt: s.lastSyncAt,
      }),
      version: 1,
    }
  )
);
