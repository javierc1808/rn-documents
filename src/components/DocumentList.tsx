import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AnimatedDocumentItem from "@/src/components/AnimatedDocumentItem";
import { SPACING, useDocumentList } from "@/src/hooks/useDocumentList";
import { useTheme } from "@/src/hooks/useTheme";
import { Document } from "@/src/models/types";

export default function DocumentList() {
  const theme = useTheme();
  const {
    data,
    isRefetching,
    refetch,
    isLoading,
    error,
    itemWidth,
    rowHeight,
    onMeasureItem,
    handleRetry,
    isGrid,
    columns,
    contentContainerStyle,
    isAnimating,
    handleAnimationComplete,
  } = useDocumentList();

  // Determine if it's the initial load (no previous data and not animating)
  const isInitialLoad = !isAnimating && (data?.length ?? 0) > 0;

  const renderItem = useCallback(
    ({ item, index }: { item: Document; index: number }) => {
      if (isGrid) {
        const isLastInRow = (index + 1) % columns === 0;

        return (
          <View
            style={[styles.documentItemContainer, {
              width: itemWidth,
              marginRight: isLastInRow ? 0 : SPACING,
              minHeight: rowHeight ?? undefined,
            }]}
            onLayout={onMeasureItem}
          >
            <AnimatedDocumentItem 
              data={item} 
              index={index}
              isAnimating={isAnimating}
              onAnimationComplete={index === 0 ? handleAnimationComplete : undefined}
              isInitialLoad={isInitialLoad}
            />
          </View>
        );
      }

      return (
        <AnimatedDocumentItem 
          data={item} 
          style={styles.documentItemContainer}
          index={index}
          isAnimating={isAnimating}
          onAnimationComplete={index === 0 ? handleAnimationComplete : undefined}
          isInitialLoad={isInitialLoad}
        />
      );
    },
    [isGrid, columns, itemWidth, rowHeight, onMeasureItem, isAnimating, handleAnimationComplete, isInitialLoad]
  );

  if (isLoading && (data?.length ?? 0) === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{error.message}</Text>

        <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.colors.primary }]} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlashList
      key={isGrid ? `grid-${rowHeight}` : "list"}
      showsVerticalScrollIndicator={false}
      data={data}
      numColumns={columns}
      contentContainerStyle={contentContainerStyle}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={{ color: theme.colors.textSecondary }}>No documents found</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  retryButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  documentItemContainer: {
    flex: 1,
    marginBottom: 16,
  },
});
