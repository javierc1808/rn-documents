import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import NotificationDrawer from "@/src/components/NotificationDrawer";

// Mock for useTheme
jest.mock("@/src/hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      background: "#ffffff",
      text: "#000000",
      textSecondary: "#666666",
      textTertiary: "#999999",
      border: "#e0e0e0",
    },
  }),
}));

// Mock for useNotificationsStore
const mockTotalItemsUnread = jest.fn();
const mockItems: any[] = [];
const mockMarkAllRead = jest.fn();
const mockMarkRead = jest.fn();
const mockClear = jest.fn();
const mockScrollToNotificationId = null;
const mockSetScrollToNotification = jest.fn();

jest.mock("@/src/stores/useNotificationsStore", () => ({
  useNotificationsStore: jest.fn(),
}));

// Mock for formatRelativeTime
jest.mock("@/src/utils/dateFormat", () => ({
  formatRelativeTime: jest.fn((date) => `formatted-${date}`),
}));

// Mock for SafeAreaView
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, ...props }: any) => {
    const { View } = require("react-native");
    return (
      <View testID="safe-area-view" {...props}>
        {children}
      </View>
    );
  },
}));

// Mock for the icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
}));

const mockNotification = {
  id: "1",
  documentTitle: "Test Document",
  type: "document.created",
  userName: "John Doe",
  createdAt: "2024-01-01T00:00:00Z",
  read: false,
};

describe("NotificationDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockTotalItemsUnread.mockReturnValue(0);

    jest
      .mocked(
        require("@/src/stores/useNotificationsStore").useNotificationsStore,
      )
      .mockImplementation((selector: any) => {
        const state = {
          totalItemsUnread: mockTotalItemsUnread,
          items: mockItems,
          markAllRead: mockMarkAllRead,
          markRead: mockMarkRead,
          clear: mockClear,
          scrollToNotificationId: mockScrollToNotificationId,
          setScrollToNotification: mockSetScrollToNotification,
        };
        return selector(state);
      });
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("notifications")).toBeTruthy();
      expect(screen.getByText("Notifications")).toBeTruthy();
    });

    it("should show the header with icon and title", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("notifications")).toBeTruthy();
      expect(screen.getByText("Notifications")).toBeTruthy();
    });

    it("should show the action buttons", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("Mark all as read")).toBeTruthy();
      expect(screen.getByText("Clear all")).toBeTruthy();
    });

    it("should render the SafeAreaView", () => {
      render(<NotificationDrawer />);

      expect(screen.getByTestId("safe-area-view")).toBeTruthy();
    });
  });

  describe("Empty state", () => {
    it("should show the no notifications message when list is empty", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("No notifications yet")).toBeTruthy();
    });

    it("should not show the unread counter when there are no notifications", () => {
      render(<NotificationDrawer />);

      expect(screen.queryByText(/unread/)).toBeNull();
    });
  });

  describe("State with notifications", () => {
    beforeEach(() => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 2,
            items: [mockNotification],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });
    });

    it("should show the unread notifications counter", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("(2 unread)")).toBeTruthy();
    });

    it("should render the notifications", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("Test Document (REAL)")).toBeTruthy();
      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("formatted-2024-01-01T00:00:00Z")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call markAllRead when 'Mark all as read' is pressed", () => {
      render(<NotificationDrawer />);

      const markAllButton = screen.getByText("Mark all as read");
      fireEvent.press(markAllButton);

      expect(mockMarkAllRead).toHaveBeenCalledTimes(1);
    });

    it("should call clear when 'Clear all' is pressed", () => {
      render(<NotificationDrawer />);

      const clearButton = screen.getByText("Clear all");
      fireEvent.press(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    it("should call markRead when a notification is pressed", () => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 1,
            items: [mockNotification],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });

      render(<NotificationDrawer />);

      const notificationItem = screen.getByText("Test Document (REAL)");
      fireEvent.press(notificationItem);

      expect(mockMarkRead).toHaveBeenCalledWith("1");
    });
  });

  describe("Type formatting", () => {
    it("should format 'document.created' as 'REAL'", () => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 1,
            items: [{ ...mockNotification, type: "document.created" }],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });

      render(<NotificationDrawer />);

      expect(screen.getByText("Test Document (REAL)")).toBeTruthy();
    });

    it("should format other types as 'FAKE'", () => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 1,
            items: [{ ...mockNotification, type: "document.updated" }],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });

      render(<NotificationDrawer />);

      expect(screen.getByText("Test Document (FAKE)")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible to the user", () => {
      render(<NotificationDrawer />);

      expect(screen.getByText("Notifications")).toBeTruthy();
      expect(screen.getByText("Mark all as read")).toBeTruthy();
      expect(screen.getByText("Clear all")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle notifications without userName", () => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 1,
            items: [{ ...mockNotification, userName: undefined }],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });

      render(<NotificationDrawer />);

      expect(screen.getByText("Test Document (REAL)")).toBeTruthy();
      expect(screen.queryByText("John Doe")).toBeNull();
    });

    it("should handle notifications without createdAt", () => {
      jest
        .mocked(
          require("@/src/stores/useNotificationsStore").useNotificationsStore,
        )
        .mockImplementation((selector: any) => {
          const state = {
            totalItemsUnread: () => 1,
            items: [{ ...mockNotification, createdAt: undefined }],
            markAllRead: mockMarkAllRead,
            markRead: mockMarkRead,
            clear: mockClear,
            scrollToNotificationId: null,
            setScrollToNotification: mockSetScrollToNotification,
          };
          return selector(state);
        });

      render(<NotificationDrawer />);

      expect(screen.getByText("Test Document (REAL)")).toBeTruthy();
      expect(screen.queryByText("formatted-2024-01-01T00:00:00Z")).toBeNull();
    });
  });
});
