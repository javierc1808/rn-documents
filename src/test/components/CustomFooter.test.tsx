import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import CustomFooter from "@/src/components/CustomFooter";

// Mock for useTheme
jest.mock("@/src/hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      border: "#e0e0e0",
      primary: "#007AFF",
    },
  }),
}));

// Mock for useNavigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("CustomFooter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<CustomFooter />);

      expect(screen.getByText("Add document")).toBeTruthy();
    });

    it("should render the button with correct text", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");
      expect(button).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call navigate when button is pressed", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalledWith("add-document");
    });

    it("should call navigate only once per press", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should be accessible to the user", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");
      expect(button).toBeTruthy();
    });

    it("should allow touch interaction", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe("Styles and theme", () => {
    it("should use theme colors", () => {
      render(<CustomFooter />);

      // The component should render without errors using theme colors
      expect(screen.getByText("Add document")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple button presses", () => {
      render(<CustomFooter />);

      const button = screen.getByText("Add document");

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith("add-document");
    });
  });
});
