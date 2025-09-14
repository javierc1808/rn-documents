import { create } from "zustand";

import { SortByEnum } from "@/src/models/enums";

interface SortByStore {
  activeElement: SortByEnum;
  isAnimating: boolean;
  setActiveElement: (element: SortByEnum) => void;
  handlePress: () => void;
  setIsAnimating: (animating: boolean) => void;
}

export const useSortByStore = create<SortByStore>((set) => ({
  activeElement: SortByEnum.RECENT,
  isAnimating: false,
  setActiveElement: (element) => set({ activeElement: element }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  handlePress: () => {
    set((state) => {
      let newElement: SortByEnum;
      switch (state.activeElement) {
        case SortByEnum.RECENT:
          newElement = SortByEnum.OLDEST;
          break;
        case SortByEnum.OLDEST:
          newElement = SortByEnum.AZ;
          break;
        case SortByEnum.AZ:
          newElement = SortByEnum.ZA;
          break;
        case SortByEnum.ZA:
          newElement = SortByEnum.RECENT;
          break;
        default:
          newElement = SortByEnum.RECENT;
      }
      
      // Change element and activate animation
      return { 
        activeElement: newElement,
        isAnimating: true
      };
    });
  }
}));