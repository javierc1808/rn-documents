import Toast from "react-native-toast-message";

import ToastService from "@/src/services/ToastService";

// Mock for react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

describe("ToastService", () => {
  let service: typeof ToastService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset singleton instance
    (ToastService as any).instance = undefined;

    // Get the singleton instance
    service = ToastService;
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance in multiple calls", () => {
      const instance1 = ToastService;
      const instance2 = ToastService;

      expect(instance1).toBe(instance2);
    });
  });

  describe("show", () => {
    it("should show a success toast with correct parameters", () => {
      const title = "Success Title";
      const message = "Success message";
      const type = "success";

      service.show(title, message, type);

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: title,
        text2: message,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });

    it("should show an error toast with correct parameters", () => {
      const title = "Error Title";
      const message = "Error message";
      const type = "error";

      service.show(title, message, type);

      expect(Toast.show).toHaveBeenCalledWith({
        type: "error",
        text1: title,
        text2: message,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });

    it("should show an info toast with correct parameters", () => {
      const title = "Info Title";
      const message = "Info message";
      const type = "info";

      service.show(title, message, type);

      expect(Toast.show).toHaveBeenCalledWith({
        type: "info",
        text1: title,
        text2: message,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });

    it("should show a warning toast with correct parameters", () => {
      const title = "Warning Title";
      const message = "Warning message";
      const type = "warning";

      service.show(title, message, type);

      expect(Toast.show).toHaveBeenCalledWith({
        type: "warning",
        text1: title,
        text2: message,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });

    it("should return the result of Toast.show", () => {
      const mockResult = { id: "test-id" };
      (Toast.show as jest.Mock).mockReturnValue(mockResult);

      const result = service.show("Title", "Message", "success");

      expect(result).toBe(mockResult);
    });

    it("should handle empty strings correctly", () => {
      service.show("", "", "info");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "info",
        text1: "",
        text2: "",
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });

    it("should handle long strings correctly", () => {
      const longTitle = "A".repeat(100);
      const longMessage = "B".repeat(200);

      service.show(longTitle, longMessage, "success");

      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: longTitle,
        text2: longMessage,
        text1Style: {
          fontSize: 16,
          fontWeight: "bold",
        },
        text2Style: {
          fontSize: 14,
        },
        position: "bottom",
        swipeable: true,
        visibilityTime: 5000,
      });
    });
  });

  describe("hide", () => {
    it("should call Toast.hide", () => {
      service.hide();

      expect(Toast.hide).toHaveBeenCalled();
    });

    it("should return the result of Toast.hide", () => {
      const mockResult = "hidden";
      (Toast.hide as jest.Mock).mockReturnValue(mockResult);

      const result = service.hide();

      expect(result).toBe(mockResult);
    });
  });

  describe("Integration", () => {
    it("should be able to show and hide toasts in sequence", () => {
      const showResult = { id: "test-id" };
      const hideResult = "hidden";

      (Toast.show as jest.Mock).mockReturnValue(showResult);
      (Toast.hide as jest.Mock).mockReturnValue(hideResult);

      const showReturn = service.show("Title", "Message", "success");
      const hideReturn = service.hide();

      expect(showReturn).toBe(showResult);
      expect(hideReturn).toBe(hideResult);
      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.hide).toHaveBeenCalledTimes(1);
    });

    it("should maintain the configuration consistent between multiple calls", () => {
      service.show("Title 1", "Message 1", "success");
      service.show("Title 2", "Message 2", "error");

      expect(Toast.show).toHaveBeenCalledTimes(2);

      // Verify that both calls have the same base configuration
      const firstCall = (Toast.show as jest.Mock).mock.calls[0][0];
      const secondCall = (Toast.show as jest.Mock).mock.calls[1][0];

      expect(firstCall.text1Style).toEqual(secondCall.text1Style);
      expect(firstCall.text2Style).toEqual(secondCall.text2Style);
      expect(firstCall.position).toBe(secondCall.position);
      expect(firstCall.swipeable).toBe(secondCall.swipeable);
      expect(firstCall.visibilityTime).toBe(secondCall.visibilityTime);
    });
  });
});
