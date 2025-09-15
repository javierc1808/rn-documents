import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import NotificationDrawer from "@/src/components/NotificationDrawer";
import { useAuthContext } from "@/src/context/AuthContext";
import { useNotificationWS } from "../hooks/useNotificationWS";

const NavigationContainer = () => {
  const { isLoading } = useAuthContext();
  useNotificationWS();

  // Show loading while authentication is being verified
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Drawer
          initialRouteName="(stack)"
          screenOptions={drawerOptions}
          drawerContent={() => <NotificationDrawer />}
        >
          <Drawer.Screen name="(stack)" />
        </Drawer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const drawerOptions : DrawerNavigationOptions = {
  headerShown: false,
  drawerPosition: "right",
  drawerType: "front",
  swipeEnabled: false,
  overlayColor: "rgba(0,0,0,0.2)",
  drawerStyle: { width: "70%", maxWidth: 420 },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NavigationContainer;