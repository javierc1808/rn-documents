import { useListByStore } from "@/src/stores/useListByStore";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";
import { useDocuments } from "./useDocuments";

export const MIN_ITEM_WIDTH = 160;
export const SPACING = 25;
export const INSET = 16;

export const useDocumentList = () => {
  const { data, isRefetching, refetch, isLoading, error } = useDocuments();
  const { width } = useWindowDimensions();

  const isGrid = useListByStore((state) => state.isGrid());

  // columnas y ancho de ítem
  const usable = Math.max(0, width - INSET * 2);
  const columns = isGrid
    ? Math.max(1, Math.floor((usable + SPACING) / (MIN_ITEM_WIDTH + SPACING)))
    : 1;

  const itemWidth = isGrid
    ? Math.floor((usable - SPACING * (columns - 1)) / columns)
    : usable;

  // alturas máximas por fila
  const [rowHeight, setRowHeight] = useState<number | null>(null);

  // reset al cambiar columnas o dataset
  useEffect(() => {
    setRowHeight(null);
  }, [columns, data?.length]);

  const handleRetry = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refetch();
  }, [refetch]);

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

  return {
    data,
    isRefetching,
    refetch,
    isLoading,
    error,
    itemWidth,
    rowHeight,
    onMeasureItem,
    handleRetry,
    columns,
    isGrid,
    contentContainerStyle,
  };
};
