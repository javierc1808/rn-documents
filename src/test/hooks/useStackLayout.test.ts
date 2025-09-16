import { renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

import { useStackLayout } from "@/src/hooks/useStackLayout";
import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

// Mock dependencies
const mockNavigationDispatch = jest.fn();
const mockOpenDrawer = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(() => ({
    dispatch: mockNavigationDispatch,
  })),
  DrawerActions: {
    openDrawer: mockOpenDrawer,
  },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Medium: "medium",
  },
}));

jest.mock("expo-notifications", () => ({
  addNotificationResponseReceivedListener: jest.fn(),
}));

jest.mock("@/src/stores/useNotificationsStore", () => ({
  useNotificationsStore: jest.fn(),
}));

const mockUseNotificationsStore = useNotificationsStore as jest.MockedFunction<
  typeof useNotificationsStore
>;
const mockHaptics = Haptics as jest.Mocked<typeof Haptics>;
const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;

describe("useStackLayout", () => {
  const mockSetScrollToNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock notifications store
    mockUseNotificationsStore.mockImplementation((selector) => {
      const state = {
        totalItemsUnread: () => 5,
        setScrollToNotification: mockSetScrollToNotification,
      };
      return selector(state as any);
    });

    // Mock haptics
    mockHaptics.impactAsync.mockResolvedValue();

    // Mock notifications
    mockNotifications.addNotificationResponseReceivedListener.mockReturnValue({
      remove: jest.fn(),
    });
  });

  it("should return the total number of unread items", () => {
    const { result } = renderHook(() => useStackLayout());

    expect(result.current.totalItemsUnread).toBe(5);
  });

  it("should format the total items correctly", () => {
    const { result } = renderHook(() => useStackLayout());

    expect(result.current.formatTotalItems).toBe("5");
  });

  it('should format numbers greater than 99 as "99+"', () => {
    mockUseNotificationsStore.mockImplementation((selector) => {
      const state = {
        totalItemsUnread: () => 150,
        setScrollToNotification: mockSetScrollToNotification,
      };
      return selector(state as any);
    });

    const { result } = renderHook(() => useStackLayout());

    expect(result.current.formatTotalItems).toBe("99+");
  });

  it("should set up notification listener on mount", () => {
    renderHook(() => useStackLayout());

    expect(
      mockNotifications.addNotificationResponseReceivedListener,
    ).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should clean up notification listener on unmount", () => {
    const mockRemove = jest.fn();
    mockNotifications.addNotificationResponseReceivedListener.mockReturnValue({
      remove: mockRemove,
    });

    const { unmount } = renderHook(() => useStackLayout());

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});
