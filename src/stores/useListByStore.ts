import { create } from "zustand";

import { ListByEnum } from "@/src/models/enums";

interface ListByStore {
  activeElement: ListByEnum;
  isAnimating: boolean;
  setActiveElement: (element: ListByEnum) => void;
  isGrid: () => boolean;
  setIsAnimating: (animating: boolean) => void;
}

export const useListByStore = create<ListByStore>((set, get) => ({
  activeElement: ListByEnum.LIST,
  isAnimating: false,
  setActiveElement: (element) => set({ activeElement: element }),
  isGrid: () => get().activeElement === ListByEnum.GRID,
  setIsAnimating: (animating) => set({ isAnimating: animating }),
}));