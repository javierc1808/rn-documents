import { create } from "zustand";

import { ListByEnum } from "../models/enums";

interface ListByStore {
  activeElement: ListByEnum;
  setActiveElement: (element: ListByEnum) => void;
}

export const useListByStore = create<ListByStore>((set) => ({
  activeElement: ListByEnum.LIST,
  setActiveElement: (element) => set({ activeElement: element }),
}));