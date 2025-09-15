import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";
import { formatRelativeTime } from "../utils/dateFormat";

export default function NotificationsDrawer() {
  const totalItemsUnread = useNotificationsStore((state) =>
    state.totalItemsUnread()
  );
  const items = useNotificationsStore((state) => state.items);
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const markRead = useNotificationsStore((state) => state.markRead);
  const clear = useNotificationsStore((state) => state.clear);
  const scrollToNotificationId = useNotificationsStore(
    (state) => state.scrollToNotificationId
  );
  const setScrollToNotification = useNotificationsStore(
    (state) => state.setScrollToNotification
  );

  const flatListRef = useRef<FlatList>(null);

  // Effect to handle automatic scroll when a specific notification is specified
  useEffect(() => {
    if (scrollToNotificationId && items.length > 0) {
      const notificationIndex = items.findIndex(
        (item) => item.id === scrollToNotificationId
      );
      if (notificationIndex !== -1 && flatListRef.current) {
        // Small delay to ensure the drawer is completely open
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: notificationIndex,
            animated: true,
            viewPosition: 0.5, // Center the notification in the view
          });

          // Clear the scrollToNotificationId after completing the scroll
          setTimeout(() => {
            setScrollToNotification(null);
          }, 1000);
        }, 300);
      }
    }
  }, [scrollToNotificationId, items, setScrollToNotification]);

  const formatType = useCallback((type: string) => {
    return type === "document.created" ? "REAL" : "FAKE";
  }, []);

  const handleMarkRead = useCallback(
    (id: string) => {
      markRead(id);
    },
    [markRead]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="notifications" size={20} />
        <Text style={styles.headerTitle}>Notifications</Text>
        {totalItemsUnread > 0 && (
          <Text style={styles.markAllButton}>({totalItemsUnread} unread)</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={markAllRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clear} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={items}
        initialNumToRender={5}
        keyExtractor={(n) => n.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No notifications yet</Text>
          </View>
        )}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failed
          console.log("Scroll to index failed:", info);
          // Try to scroll to a nearby position
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }, 100);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleMarkRead(item.id)}
            style={[styles.notificationItem, { opacity: item.read ? 0.5 : 1 }]}
            accessibilityLabel={`Notification: ${item.documentTitle}`}
          >
            <Text style={{ fontWeight: item.read ? "400" : "600" }}>
              {item.documentTitle} ({formatType(item.type)})
            </Text>
            {item.userName && (
              <Text numberOfLines={2} style={styles.notificationBody}>
                {item.userName}
              </Text>
            )}
            {item.createdAt && (
              <Text style={styles.notificationTime}>
                {formatRelativeTime(item.createdAt)}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  markAllButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  markAllText: {
    fontWeight: "600",
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
  },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationBody: {
    marginTop: 2,
    color: "#555",
  },
  notificationTime: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },
});
