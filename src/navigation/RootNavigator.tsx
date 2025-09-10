import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import CustomRightHeader from "@/src/components/CustomRightHeader";
import { useAuthContext } from "@/src/context/AuthContext";

export const RootNavigator = () => {

  const { isLoading } = useAuthContext();

  const navigationOptionsDocument = {
    headerTitle: "Documents",
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: "bold" as const,
    },
    headerRight: CustomRightHeader,
  };

  // Mostrar loading mientras se verifica la autenticación
  if (!isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={navigationOptionsDocument} />
      <Stack.Screen name="document" options={{ headerShown: false, presentation: "pageSheet" }} />
    </Stack>
  );
};
