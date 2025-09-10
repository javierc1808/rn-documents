import { create } from "zustand";

interface ListByStore {
  activeElement: "list" | "grid";
  setActiveElement: (element: "list" | "grid") => void;
}

export const useListByStore = create<ListByStore>((set) => ({
  activeElement: "list",
  setActiveElement: (element) => set({ activeElement: element }),
}));