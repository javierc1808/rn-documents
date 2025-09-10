import { create } from "zustand";

export enum ListByEnum {
  LIST = "list",
  GRID = "grid",
}

interface ListByStore {
  activeElement: ListByEnum;
  setActiveElement: (element: ListByEnum) => void;
}

export const useListByStore = create<ListByStore>((set) => ({
  activeElement: ListByEnum.LIST,
  setActiveElement: (element) => set({ activeElement: element }),
}));