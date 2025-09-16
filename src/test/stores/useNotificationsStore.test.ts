import { faker } from "@faker-js/faker";
import { act, renderHook } from "@testing-library/react-native";

import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

// Mock for storage
jest.mock("@/src/services/storage", () => ({
  Storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe("useNotificationsStore", () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useNotificationsStore.getState().clear();
    });
  });

  describe("Initial state", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useNotificationsStore());

      expect(result.current.items).toEqual([]);
      expect(result.current.scrollToNotificationId).toBeNull();
      expect(result.current.totalItemsUnread()).toBe(0);
    });
  });

  describe("add", () => {
    it("should add a new notification", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notification = {
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        ...notification,
        read: false,
      });
      expect(result.current.items[0].id).toBeDefined();
    });

    it("should add a notification with custom id and read status", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const customId = faker.string.uuid();
      const notification = {
        id: customId,
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
        read: true,
      };

      act(() => {
        result.current.add(notification);
      });

      expect(result.current.items[0]).toMatchObject({
        id: customId,
        read: true,
      });
    });

    it("should not add a duplicate notification with the same documentId", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const documentId = faker.string.uuid();
      const notification1 = {
        documentId,
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      const notification2 = {
        documentId,
        documentTitle: faker.lorem.words(3),
        type: "warning",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification1);
        result.current.add(notification2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].documentId).toBe(documentId);
    });

    it("should limit notifications to 150 items", () => {
      const { result } = renderHook(() => useNotificationsStore());

      // Create 151 notifications
      const notifications = Array.from({ length: 151 }, () => ({
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      }));

      act(() => {
        notifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      expect(result.current.items).toHaveLength(150);
    });

    it("should keep the first 150 notifications when limit is exceeded", () => {
      const { result } = renderHook(() => useNotificationsStore());

      // Create 150 initial notifications
      const initialNotifications = Array.from({ length: 150 }, (_, index) => ({
        documentId: faker.string.uuid(),
        documentTitle: `Initial ${index}`,
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      }));

      act(() => {
        initialNotifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      const newNotification = {
        documentId: faker.string.uuid(),
        documentTitle: "New notification",
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(newNotification);
      });

      expect(result.current.items).toHaveLength(150);
      expect(result.current.items[0].documentTitle).toBe("New notification");
      expect(result.current.items[149].documentTitle).toBe("Initial 1");
    });
  });

  describe("markRead", () => {
    it("should mark a notification as read", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notification = {
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification);
      });

      const notificationId = result.current.items[0].id;

      act(() => {
        result.current.markRead(notificationId);
      });

      expect(result.current.items[0].read).toBe(true);
    });

    it("should not affect other notifications when marking one as read", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notification1 = {
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      const notification2 = {
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "warning",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification1);
        result.current.add(notification2);
      });

      const notificationId1 = result.current.items[0].id;

      act(() => {
        result.current.markRead(notificationId1);
      });

      expect(result.current.items[0].read).toBe(true);
      expect(result.current.items[1].read).toBe(false);
    });

    it("should do nothing if the notification does not exist", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notification = {
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification);
      });

      const initialItems = result.current.items;

      act(() => {
        result.current.markRead("non-existent-id");
      });

      expect(result.current.items).toEqual(initialItems);
    });
  });

  describe("markAllRead", () => {
    it("should mark all notifications as read", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notifications = Array.from({ length: 5 }, () => ({
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      }));

      act(() => {
        notifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      act(() => {
        result.current.markAllRead();
      });

      expect(result.current.items.every((item) => item.read)).toBe(true);
    });

    it("should do nothing if there are no notifications", () => {
      const { result } = renderHook(() => useNotificationsStore());

      act(() => {
        result.current.markAllRead();
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("clear", () => {
    it("should clear all notifications", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notifications = Array.from({ length: 3 }, () => ({
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      }));

      act(() => {
        notifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      expect(result.current.items).toHaveLength(3);

      act(() => {
        result.current.clear();
      });

      expect(result.current.items).toEqual([]);
    });
  });

  describe("setScrollToNotification", () => {
    it("should set the notification ID to scroll to", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notificationId = faker.string.uuid();

      act(() => {
        result.current.setScrollToNotification(notificationId);
      });

      expect(result.current.scrollToNotificationId).toBe(notificationId);
    });

    it("should set scrollToNotificationId to null", () => {
      const { result } = renderHook(() => useNotificationsStore());

      act(() => {
        result.current.setScrollToNotification(null);
      });

      expect(result.current.scrollToNotificationId).toBeNull();
    });
  });

  describe("totalItemsUnread", () => {
    it("should correctly count unread notifications", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notifications = Array.from({ length: 5 }, (_, index) => ({
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
        read: index < 3, // First 3 are read
      }));

      act(() => {
        notifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      expect(result.current.totalItemsUnread()).toBe(2);
    });

    it("should return 0 when there are no notifications", () => {
      const { result } = renderHook(() => useNotificationsStore());

      expect(result.current.totalItemsUnread()).toBe(0);
    });

    it("should return 0 when all notifications are read", () => {
      const { result } = renderHook(() => useNotificationsStore());

      const notifications = Array.from({ length: 3 }, () => ({
        documentId: faker.string.uuid(),
        documentTitle: faker.lorem.words(3),
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
        read: true,
      }));

      act(() => {
        notifications.forEach((notification) => {
          result.current.add(notification);
        });
      });

      expect(result.current.totalItemsUnread()).toBe(0);
    });
  });

  describe("Integration", () => {
    it("should correctly handle a complete notification flow", () => {
      const { result } = renderHook(() => useNotificationsStore());

      // Add notifications
      const notification1 = {
        documentId: faker.string.uuid(),
        documentTitle: "Document 1",
        type: "info",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      const notification2 = {
        documentId: faker.string.uuid(),
        documentTitle: "Document 2",
        type: "warning",
        createdAt: faker.date.recent().toISOString(),
        userName: faker.person.fullName(),
        userId: faker.string.uuid(),
      };

      act(() => {
        result.current.add(notification1);
        result.current.add(notification2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.totalItemsUnread()).toBe(2);

      // Mark one as read
      const notificationId1 = result.current.items[0].id;
      act(() => {
        result.current.markRead(notificationId1);
      });

      expect(result.current.totalItemsUnread()).toBe(1);
      expect(result.current.items[0].read).toBe(true);
      expect(result.current.items[1].read).toBe(false);

      // Set scroll
      act(() => {
        result.current.setScrollToNotification(notificationId1);
      });

      expect(result.current.scrollToNotificationId).toBe(notificationId1);

      // Mark all as read
      act(() => {
        result.current.markAllRead();
      });

      expect(result.current.totalItemsUnread()).toBe(0);
      expect(result.current.items.every((item) => item.read)).toBe(true);

      // Clear
      act(() => {
        result.current.clear();
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItemsUnread()).toBe(0);
    });
  });
});
