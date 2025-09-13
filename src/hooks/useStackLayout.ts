import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export const useStackLayout = () => {
  const navigation = useNavigation();
  const totalItems = useNotificationsStore(state => state.items.length);

  const formatTotalItems = useMemo(
    () => (totalItems > 99 ? "99+" : totalItems),
    [totalItems]
  );

  const openNotifications = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    navigation.dispatch(DrawerActions.openDrawer());
  };

  return {
    totalItems,
    formatTotalItems,
    openNotifications,
  };
};