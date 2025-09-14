import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { AuthProvider } from "@/src/context/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import NavigationContainer from "@/src/navigation";

const queryClient = new QueryClient();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  const theme = useTheme();

  return (
    <ThemeProvider value={theme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer />

          <Toast />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
