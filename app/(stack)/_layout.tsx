import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useStackLayout } from "@/src/hooks/useStackLayout";

export default function StackLayout() {
  const { totalItems, formatTotalItems, openNotifications } = useStackLayout();

  const notificationBadgeContainerStyle = useMemo(
    () => [styles.notificationBadgeContainer, totalItems > 99 && { left: 12 }],
    [totalItems]
  );

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Documents",
          headerTitleStyle: styles.headerTitle,
          headerRight: () => (
            <TouchableOpacity
              onPress={openNotifications}
              hitSlop={10}
              accessibilityLabel="Open notifications"
              style={styles.container}
            >
              {totalItems > 0 && (
                <View style={notificationBadgeContainerStyle}>
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {formatTotalItems}
                    </Text>
                  </View>
                </View>
              )}
              <MaterialIcons
                name="notifications-none"
                size={18}
                color="black"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-document"
        options={{
          headerTitle: "Add document",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationBadgeContainer: {
    position: "absolute",
    left: 15,
    right: 0,
    top: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    minWidth: 15,
    height: 15,
    backgroundColor: "#4281F2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    zIndex: 10,
  },
  notificationBadgeText: {
    fontSize: 10,
    color: "white",
    paddingHorizontal: 2,
  },
});
