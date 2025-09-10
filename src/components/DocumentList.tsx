import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View } from 'react-native';

import DocumentItem from '@/src/components/DocumentItem';
import { useDocuments } from '@/src/hooks/useDocuments';

export default function DocumentList() {

  const { data, isRefetching, refetch, isLoading, error } = useDocuments();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={({ item }) => (
          <DocumentItem data={item} />
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        estimatedItemSize={200}
      />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
