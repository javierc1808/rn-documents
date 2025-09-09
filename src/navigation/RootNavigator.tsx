import CustomRightHeader from "@/src/components/CustomRightHeader";
import { Stack } from "expo-router";

export const RootNavigator = () => {

  const navigationOptionsDocument = {
    headerTitle: "Documents",
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: "bold" as const,
    },
    headerRight: CustomRightHeader,
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={navigationOptionsDocument} />
      <Stack.Screen name="document" options={{ headerShown: false, presentation: "pageSheet" }} />
    </Stack>
  );
};
