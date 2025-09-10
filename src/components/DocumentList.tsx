import { FlashList } from '@shopify/flash-list';
import { RefreshControl, StyleSheet } from 'react-native';

import { useDocuments } from '../hooks/useDocuments';
import DocumentItem from './DocumentItem';

export default function DocumentList() {

  const { data, isRefetching, refetch } = useDocuments();

  return (
    <FlashList
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
});
