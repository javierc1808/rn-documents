import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

import { AuthProvider } from "@/src/context/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import { RootNavigator } from "@/src/navigation/RootNavigator";

export default function RootLayout() {

  const theme = useTheme();
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
