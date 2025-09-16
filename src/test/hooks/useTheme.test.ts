import { renderHook } from "@testing-library/react-native";
import { useTheme } from "../../hooks/useTheme";

import { useColorScheme } from "react-native";

// Mock for useColorScheme
jest.mock("react-native", () => ({
  useColorScheme: jest.fn(),
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;

describe("useTheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return light theme when color scheme is 'light'", () => {
    mockUseColorScheme.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDark).toBe(false);
    expect(result.current.colors.background).toBe("#FFFFFF");
    expect(result.current.colors.text).toBe("#000000");
    expect(result.current.colors.card).toBe("#FFFFFF");
  });

  it("should return dark theme when color scheme is 'dark'", () => {
    mockUseColorScheme.mockReturnValue("dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDark).toBe(true);
    expect(result.current.colors.background).toBe("#000000");
    expect(result.current.colors.text).toBe("#FFFFFF");
    expect(result.current.colors.card).toBe("#1C1C1E");
  });

  it("should include custom colors in both themes", () => {
    mockUseColorScheme.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.colors.primary).toBe("#007AFF");
    expect(result.current.colors.error).toBe("#FF3B30");
    expect(result.current.colors.success).toBe("#34C759");
    expect(result.current.colors.warning).toBe("#FF9500");
  });

  it("should have different colors for light and dark themes", () => {
    mockUseColorScheme.mockReturnValue("light");
    const { result: lightTheme } = renderHook(() => useTheme());

    mockUseColorScheme.mockReturnValue("dark");
    const { result: darkTheme } = renderHook(() => useTheme());

    expect(lightTheme.current.colors.text).not.toBe(
      darkTheme.current.colors.text,
    );
    expect(lightTheme.current.colors.background).not.toBe(
      darkTheme.current.colors.background,
    );
    expect(lightTheme.current.isDark).toBe(false);
    expect(darkTheme.current.isDark).toBe(true);
  });
});
