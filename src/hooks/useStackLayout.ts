import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export const useStackLayout = () => {
  const navigation = useNavigation();
  const totalItemsUnread = useNotificationsStore(state => state.totalItemsUnread());
  const setScrollToNotification = useNotificationsStore(state => state.setScrollToNotification);

  const formatTotalItems = useMemo(
    () => (totalItemsUnread > 99 ? "99+" : totalItemsUnread.toString()),
    [totalItemsUnread]
  );

  const openNotifications = async (notificationId?: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // If a notification is specified, configure automatic scroll
    if (notificationId) {
      setScrollToNotification(notificationId);
    } else {
      // Clear automatic scroll if no notification is specified
      setScrollToNotification(null);
    }

    navigation.dispatch(DrawerActions.openDrawer());
  };

  return {
    totalItemsUnread,
    formatTotalItems,
    openNotifications,
  };
};