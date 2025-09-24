import { useSyncExternalStore } from "react";
import { SortByEnum } from "../models/enums";
import { createStore } from "../utils/store";

const globalSortBy = createStore<SortByEnum>(SortByEnum.RECENT);
const globalIsAnimating = createStore<boolean>(false);

export const useGlobalSortBy = () => {
  const sortBy = useSyncExternalStore(globalSortBy.subscribe, globalSortBy.get);
  const isAnimating = useSyncExternalStore(globalIsAnimating.subscribe, globalIsAnimating.get);

  const handlePress = () => {
    let newElement: SortByEnum;

    switch (sortBy) {
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

    setSortBy(newElement);
    setIsAnimating(true);
  };

  const setIsAnimating = (animating: boolean) => {
    globalIsAnimating.set(animating);
  };

  const setSortBy = (sortBy: SortByEnum) => {
    globalSortBy.set(sortBy);
  };

  return { sortBy, isAnimating, handlePress, setIsAnimating, setSortBy };
};