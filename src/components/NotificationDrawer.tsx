import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export default function NotificationsDrawer() {
  const { items, markAllRead, markRead, clear } = useNotificationsStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="notifications" size={20} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity
          onPress={markAllRead}
          style={styles.markAllButton}
        >
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clear}
          style={styles.markAllButton}
        >
          <Text style={styles.markAllText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        // data={[
        //   {
        //     id: "1",
        //     createdAt: "2020-08-12T07:30:08.28093+02:00",
        //     userId: "3ffe27e5-fe2c-45ea-8b3c-879b757b0455",
        //     userName: "Alicia Wolf",
        //     documentId: "f09acc46-3875-4eff-8831-10ccf3356420",
        //     documentTitle: "Edmund Fitzgerald Porter",
        //     read: true,
        //   },
        //   {
        //     id: "2",
        //     createdAt: "2020-08-12T07:30:08.281305+02:00",
        //     userId: "fd525a6d-1255-4427-91fa-86af21e805d3",
        //     userName: "Cindy Weissnat",
        //     documentId: "8d9b79cc-a48c-4f62-b385-607feb4276b8",
        //     documentTitle: "Schneider Aventinus",
        //     read: false,
        //   },
        // ]}
        initialNumToRender={5}
        keyExtractor={(n) => n.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No notifications yet</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markRead(item.id)}
            style={[styles.notificationItem, { opacity: item.read ? 0.5 : 1 }]}
            accessibilityLabel={`Notification: ${item.documentTitle}`}
          >
            <Text style={{ fontWeight: item.read ? "400" : "600" }}>
              {item.documentTitle}
            </Text>
            {item.userName && (
              <Text numberOfLines={2} style={styles.notificationBody}>
                {item.userName}
              </Text>
            )}
            {item.createdAt && (
              <Text style={styles.notificationTime}>{item.createdAt}</Text>
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
