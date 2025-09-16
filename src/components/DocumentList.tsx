import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

import AnimatedDocumentItem from "@/src/components/AnimatedDocumentItem";
import { DocumentListEmpty } from "@/src/components/DocumentListEmpty";
import { DocumentListHeader } from "@/src/components/DocumentListHeader";
import { DocumentListLoading } from "@/src/components/DocumentListLoading";
import { SPACING, useDocumentList } from "@/src/hooks/useDocumentList";
import { useDocumentListLogic } from "@/src/hooks/useDocumentListLogic";
import { Document } from "@/src/models/types";

export default function DocumentList() {
  const {
    itemWidth,
    rowHeight,
    onMeasureItem,
    isGrid,
    columns,
    contentContainerStyle,
    isAnimating,
    handleAnimationComplete,
  } = useDocumentList();

  const {
    items,
    networkStatus,
    errorMessage,
    lastSyncAt,
    isRefetching,
    refetch,
    shouldShowLoading,
    isInitialLoad,
  } = useDocumentListLogic();

  const RenderItem = useCallback(
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

  if (shouldShowLoading) {
    return <DocumentListLoading />;
  }

  return (
    <>
      <FlashList
        key={isGrid ? `grid-${rowHeight}` : "list"}
        showsVerticalScrollIndicator={false}
        data={items}
        numColumns={columns}
        contentContainerStyle={contentContainerStyle}
        renderItem={RenderItem}
        ListHeaderComponent={
          <DocumentListHeader
            networkStatus={networkStatus}
            errorMessage={errorMessage}
            lastSyncAt={lastSyncAt}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={<DocumentListEmpty />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  documentItemContainer: {
    flex: 1,
    marginBottom: 16,
  },
});
