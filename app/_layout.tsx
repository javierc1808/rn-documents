import { useTheme } from "@/src/hooks/useTheme";
import { RootNavigator } from "@/src/navigation/RootNavigator";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

export default function RootLayout() {

  const theme = useTheme();
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <ThemeProvider value={theme}>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
