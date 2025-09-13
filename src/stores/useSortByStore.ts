import { create } from "zustand";

import { SortByEnum } from "@/src/models/enums";

interface SortByStore {
  activeElement: SortByEnum;
  setActiveElement: (element: SortByEnum) => void;
  handlePress: () => void;
}

export const useSortByStore = create<SortByStore>((set) => ({
  activeElement: SortByEnum.RECENT,
  setActiveElement: (element) => set({ activeElement: element }),
  handlePress: () => {
    set((state) => {
      switch (state.activeElement) {
        case SortByEnum.RECENT:
          return { activeElement: SortByEnum.OLDEST };
        case SortByEnum.OLDEST:
          return { activeElement: SortByEnum.AZ };
        case SortByEnum.AZ:
          return { activeElement: SortByEnum.ZA };
        case SortByEnum.ZA:
          return { activeElement: SortByEnum.RECENT };
        default:
          return { activeElement: SortByEnum.RECENT };
      }
    })
  }
}));