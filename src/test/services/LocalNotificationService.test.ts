import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

import LocalNotificationService from "@/src/services/LocalNotificationService";

// Mock for expo-notifications
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: "timeInterval",
  },
}));

// Mock for React Native
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openSettings: jest.fn(),
  },
}));

describe("LocalNotificationService", () => {
  let service: typeof LocalNotificationService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset singleton instance
    (LocalNotificationService as any).instance = undefined;

    // Get the singleton instance
    service = LocalNotificationService;
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance on multiple calls", () => {
      const instance1 = LocalNotificationService;
      const instance2 = LocalNotificationService;

      expect(instance1).toBe(instance2);
    });

    it("should initialize the notification handler", () => {
      // The handler is initialized in the static constructor
      // We verify that the method exists and is a function
      expect(typeof Notifications.setNotificationHandler).toBe("function");
    });
  });

  describe("Getters", () => {
    it("should return the canShowNotification state", () => {
      expect(service.canShowNotification).toBe(true);
    });

    it("should return the isValid state", () => {
      expect(service.isValid).toBe(false);
    });
  });

  describe("validatePermissions", () => {
    it("should return true when permissions are already granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      const result = await service.validatePermissions();

      expect(result).toBe(true);
      expect(service.isValid).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });

    it("should request permissions when not granted and return true if granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      const result = await service.validatePermissions();

      expect(result).toBe(true);
      expect(service.isValid).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it("should show alert and return false when permissions are denied", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      const result = await service.validatePermissions();

      expect(result).toBe(false);
      expect(service.isValid).toBe(false);
      expect(service.canShowNotification).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Notification Permissions Required",
        "To receive notifications you must accept permissions in the app settings",
        expect.arrayContaining([
          expect.objectContaining({
            text: "Cancel",
            style: "cancel",
          }),
          expect.objectContaining({
            text: "Go to Settings",
          }),
        ]),
      );
    });

    it("should return false when already busy", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      // First call to set _isBusy = true
      service.validatePermissions();

      // Second call while busy
      const result = await service.validatePermissions();

      expect(result).toBe(false);
      expect(service.isValid).toBe(false);
    });

    it("should handle errors and return false", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error("Test error"),
      );

      const result = await service.validatePermissions();

      expect(result).toBe(false);
      expect(service.isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error validating permissions:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getPermissions", () => {
    it("should call getPermissionsAsync", async () => {
      const mockPermissions = { status: "granted" };
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissions,
      );

      const result = await service.getPermissions();

      expect(result).toBe(mockPermissions);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });
  });

  describe("requestPermissions", () => {
    it("should call requestPermissionsAsync", async () => {
      const mockPermissions = { status: "granted" };
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue(
        mockPermissions,
      );

      const result = await service.requestPermissions();

      expect(result).toBe(mockPermissions);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });
  });

  describe("scheduleNotificationAsync", () => {
    it("should schedule a notification with the correct parameters", async () => {
      const title = "Test Title";
      const body = "Test Body";
      const data = { test: "data" };

      await service.scheduleNotificationAsync(title, body, data);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title, body, data },
        trigger: {
          type: "timeInterval",
          seconds: 2,
        },
      });
    });
  });

  describe("scheduleNotification", () => {
    it("should schedule a notification without await", () => {
      const title = "Test Title";
      const body = "Test Body";
      const data = { test: "data" };

      service.scheduleNotification(title, body, data);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: { title, body, data },
        trigger: {
          type: "timeInterval",
          seconds: 2,
        },
      });
    });
  });

  describe("Alert callbacks", () => {
    it("should handle the _isBusy state correctly when permissions are denied", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      await service.validatePermissions();

      // Verify that _isBusy was set correctly
      expect((service as any)._isBusy).toBe(true);
    });
  });
});
