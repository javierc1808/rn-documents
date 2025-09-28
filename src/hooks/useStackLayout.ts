import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo } from "react";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export const useStackLayout = () => {
  const navigation = useNavigation();
  const totalItemsUnread = useNotificationsStore((state) =>
    state.totalItemsUnread()
  );
  const setScrollToNotification = useNotificationsStore(
    (state) => state.setScrollToNotification
  );

  const openNotifications = useCallback(
    (notificationId?: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // If a notification is specified, configure automatic scroll
      if (notificationId) {
        setScrollToNotification(notificationId);
      } else {
        // Clear automatic scroll if no notification is specified
        setScrollToNotification(null);
      }

      navigation.dispatch(DrawerActions.openDrawer());
    },
    [navigation, setScrollToNotification]
  );

  // Listener to handle when a notification is pressed
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        // If the notification has a documentId, search for the corresponding notification
        if (data && data.document_id) {
          const notifications = useNotificationsStore.getState().items;
          const notification = notifications.find(
            (n) => n.documentId === data.documentId
          );

          if (notification) {
            // Open drawer and scroll to specific notification
            openNotifications(notification.id);
          } else {
            // If notification is not found, open drawer normally
            openNotifications();
          }
        } else {
          // If there's no specific data, open drawer normally
          openNotifications();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [openNotifications]);

  const formatTotalItems = useMemo(
    () => (totalItemsUnread > 99 ? "99+" : totalItemsUnread.toString()),
    [totalItemsUnread]
  );

  return {
    totalItemsUnread,
    formatTotalItems,
    openNotifications,
  };
};
