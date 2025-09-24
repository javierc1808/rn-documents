import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";

import { useDocumentsStore } from "@/src/stores/useDocumentsStore";
import { useListByStore } from "@/src/stores/useListByStore";
import { useSortByStore } from "@/src/stores/useSortByStore";

export const MIN_ITEM_WIDTH = 160;
export const SPACING = 25;
export const INSET = 16;

export const useDocumentList = () => {
  const { width } = useWindowDimensions();
  const items = useDocumentsStore((s) => s.items);

  const isGrid = useListByStore((state) => state.isGrid());
  const isListAnimating = useListByStore((state) => state.isAnimating);
  const setIsListAnimating = useListByStore((state) => state.setIsAnimating);
  
  const isSortAnimating = useSortByStore((state) => state.isAnimating);
  const setIsSortAnimating = useSortByStore((state) => state.setIsAnimating);
  // const { isAnimating: isSortAnimating, setIsAnimating: setIsSortAnimating } = useGlobalSortBy();
  
  // Combine both animation states
  const isAnimating = isListAnimating || isSortAnimating;

  // columns and item width
  const usable = Math.max(0, width - INSET * 2);
  const columns = isGrid
    ? Math.max(1, Math.floor((usable + SPACING) / (MIN_ITEM_WIDTH + SPACING)))
    : 1;

  const itemWidth = isGrid
    ? Math.floor((usable - SPACING * (columns - 1)) / columns)
    : usable;

  // maximum heights per row
  const [rowHeight, setRowHeight] = useState<number | null>(null);

  // reset when columns or dataset change
  useEffect(() => {
    setRowHeight(null);
  }, [columns, items?.length]);

  // Detect SortBy changes and activate animation
  useEffect(() => {
    if (isSortAnimating) {
      // Animation is already activated from the store
      // We only need to reset rowHeight to force re-render
      setRowHeight(null);
    }
  }, [isSortAnimating]);

  const onMeasureItem = useCallback((e: LayoutChangeEvent): void => {
    const h = e.nativeEvent.layout.height;
    setRowHeight((prev) => {
      const curr = prev ?? 0;
      return h > curr ? h : prev;
    });
  }, []);


  const contentContainerStyle = useMemo(() => {
    return {
      paddingHorizontal: INSET,
      paddingTop: isGrid ? INSET : 0,
      paddingBottom: isGrid ? INSET : 0,
    };
  }, [isGrid]);

  const handleAnimationComplete = useCallback(() => {
    setIsListAnimating(false);
    setIsSortAnimating(false);
  }, [setIsListAnimating, setIsSortAnimating]);

  return {
    itemWidth,
    rowHeight,
    onMeasureItem,
    columns,
    isGrid,
    contentContainerStyle,
    isAnimating,
    handleAnimationComplete,
  };
};
