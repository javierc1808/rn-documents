import { create } from "zustand";

import { ListByEnum } from "@/src/models/enums";

interface ListByStore {
  activeElement: ListByEnum;
  setActiveElement: (element: ListByEnum) => void;
  isGrid: () => boolean;
}

export const useListByStore = create<ListByStore>((set, get) => ({
  activeElement: ListByEnum.LIST,
  setActiveElement: (element) => set({ activeElement: element }),
  isGrid: () => get().activeElement === ListByEnum.GRID,
}));