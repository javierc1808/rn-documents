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

import DocumentItem from "@/src/components/DocumentItem";
import { SPACING, useDocumentList } from "@/src/hooks/useDocumentList";
import { Document } from "@/src/models/types";

export default function DocumentList() {
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
  } = useDocumentList();

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
            <DocumentItem data={item} />
          </View>
        );
      }

      return <DocumentItem data={item} style={styles.documentItemContainer} />;
    },
    [isGrid, columns, itemWidth, rowHeight, onMeasureItem]
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
        <Text style={styles.errorText}>{error.message}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
          <Text>No documents found</Text>
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
    backgroundColor: "#4281F2",
    borderRadius: 10,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  documentItemContainer: {
    flex: 1,
    marginBottom: 16,
  },
});
