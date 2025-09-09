import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export const useTheme = () => {

  const colorScheme = useColorScheme();

  return colorScheme === 'dark' ? DarkTheme : DefaultTheme;

}