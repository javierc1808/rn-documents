import { useTheme } from "@/src/hooks/useTheme";
import { RootNavigator } from "@/src/navigation/RootNavigator";
import { ThemeProvider } from "@react-navigation/native";
import { StrictMode } from "react";

export default function RootLayout() {

  const theme = useTheme();

  return (
    <StrictMode>
      <ThemeProvider value={theme}>
        <RootNavigator />
      </ThemeProvider>
    </StrictMode>
  );
}
