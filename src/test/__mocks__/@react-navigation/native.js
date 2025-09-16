// Mock para @react-navigation/native
export const DarkTheme = {
  colors: {
    primary: "#007AFF",
    background: "#000000",
    card: "#1C1C1E",
    text: "#FFFFFF",
    border: "#38383A",
    notification: "#FF3B30",
  },
};

export const DefaultTheme = {
  colors: {
    primary: "#007AFF",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#E5E5EA",
    notification: "#FF3B30",
  },
};

// Mock para useColorScheme
export const useColorScheme = () => "light";

// Mock para otros hooks de navegación si es necesario
export const useNavigation = () => ({
  navigate: () => {},
  goBack: () => {},
  reset: () => {},
});

export const useRoute = () => ({
  params: {},
});

export const useFocusEffect = () => {};
export const useIsFocused = () => true;
