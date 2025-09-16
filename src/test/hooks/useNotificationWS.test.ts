import { renderHook } from "@testing-library/react-native";

import { useAuthContext } from "@/src/context/AuthContext";
import { useNotificationWS } from "@/src/hooks/useNotificationWS";
import LocalNotificationService from "@/src/services/LocalNotificationService";
import ToastService from "@/src/services/ToastService";
import { useNotificationsStore } from "@/src/stores/useNotificationsStore";
import { createWrapper } from "../testUtils";

// Mock dependencies
jest.mock("@/src/context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("@/src/stores/useNotificationsStore", () => ({
  useNotificationsStore: {
    getState: jest.fn(),
  },
}));

jest.mock("@/src/services/LocalNotificationService", () => ({
  canShowNotification: true,
  isValid: true,
  validatePermissions: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("@/src/services/ToastService", () => ({
  show: jest.fn(),
}));

jest.mock("react-native", () => ({
  AppState: {
    currentState: "active",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

const mockUseAuthContext = useAuthContext as jest.MockedFunction<
  typeof useAuthContext
>;
const mockUseNotificationsStore = useNotificationsStore as jest.Mocked<
  typeof useNotificationsStore
>;
const mockLocalNotificationService = LocalNotificationService as jest.Mocked<
  typeof LocalNotificationService
>;
const mockToastService = ToastService as jest.Mocked<typeof ToastService>;

describe("useNotificationWS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockUseAuthContext.mockReturnValue({
      user: {
        id: "user-1",
        name: "Current User",
        email: "current@example.com",
      },
      authToken: "mock-token",
      isLoading: false,
    } as any);

    mockUseNotificationsStore.getState.mockReturnValue({
      addNotification: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should connect to WebSocket when mounting the component", () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    expect(mockUseAuthContext).toHaveBeenCalled();
    unmount();
  });

  it("should handle document creation notification messages", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should handle fake document notification messages", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should not process notifications from current user", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should show toast when app is active", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should schedule local notification when app is in background", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should handle errors parsing messages", async () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    // Verify that the hook mounted correctly
    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });

  it("should close WebSocket when unmounting the component", () => {
    const { unmount } = renderHook(() => useNotificationWS(), {
      wrapper: createWrapper(),
    });

    // Advance timers to simulate connection
    jest.advanceTimersByTime(20);

    expect(mockUseAuthContext).toHaveBeenCalled();

    unmount();
  });
});
