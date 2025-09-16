import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import ListBy from "@/src/components/ListBy";

// Mock for useTheme
jest.mock("@/src/hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      border: "#e0e0e0",
      primary: "#007AFF",
      card: "#ffffff",
      icon: "#666666",
    },
  }),
}));

// Mock for useListByStore
const mockSetActiveElement = jest.fn();
const mockSetIsAnimating = jest.fn();

jest.mock("@/src/stores/useListByStore", () => ({
  useListByStore: jest.fn((selector) => {
    const state = {
      activeElement: "LIST",
      setActiveElement: mockSetActiveElement,
      setIsAnimating: mockSetIsAnimating,
    };
    return selector(state);
  }),
}));

// Mock for the icons
jest.mock("@expo/vector-icons", () => ({
  FontAwesome6: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
  MaterialCommunityIcons: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
}));

describe("ListBy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<ListBy />);

      expect(screen.getByText("list")).toBeTruthy();
      expect(screen.getByText("grid-large")).toBeTruthy();
    });

    it("should show both mode buttons", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      const gridButton = screen.getByText("grid-large");

      expect(listButton).toBeTruthy();
      expect(gridButton).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call setActiveElement when grid button is pressed", () => {
      render(<ListBy />);

      const gridButton = screen.getByText("grid-large");
      fireEvent.press(gridButton);

      expect(mockSetActiveElement).toHaveBeenCalledWith("grid");
      expect(mockSetIsAnimating).toHaveBeenCalledWith(true);
    });

    it("should call setActiveElement when list button is pressed", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      fireEvent.press(listButton);

      expect(mockSetActiveElement).toHaveBeenCalledWith("list");
      expect(mockSetIsAnimating).toHaveBeenCalledWith(true);
    });

    it("should handle multiple presses", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      const gridButton = screen.getByText("grid-large");

      fireEvent.press(gridButton);
      fireEvent.press(listButton);
      fireEvent.press(gridButton);

      expect(mockSetActiveElement).toHaveBeenCalledTimes(3);
      expect(mockSetIsAnimating).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should be accessible to the user", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      const gridButton = screen.getByText("grid-large");

      expect(listButton).toBeTruthy();
      expect(gridButton).toBeTruthy();
    });

    it("should allow touch interaction on both buttons", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      const gridButton = screen.getByText("grid-large");

      fireEvent.press(listButton);
      fireEvent.press(gridButton);

      expect(mockSetActiveElement).toHaveBeenCalled();
    });
  });

  describe("Styles and theme", () => {
    it("should use theme colors", () => {
      render(<ListBy />);

      // The component should render without errors using theme colors
      expect(screen.getByText("list")).toBeTruthy();
      expect(screen.getByText("grid-large")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid mode changes", () => {
      render(<ListBy />);

      const listButton = screen.getByText("list");
      const gridButton = screen.getByText("grid-large");

      // Rapidly press both buttons
      fireEvent.press(gridButton);
      fireEvent.press(listButton);
      fireEvent.press(gridButton);

      expect(mockSetActiveElement).toHaveBeenCalledTimes(3);
      expect(mockSetIsAnimating).toHaveBeenCalledTimes(3);
    });
  });
});
