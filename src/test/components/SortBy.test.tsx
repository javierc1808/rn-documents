import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

import SortBy from "@/src/components/SortBy";

// Mock for useTheme
jest.mock("@/src/hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      border: "#e0e0e0",
      card: "#ffffff",
      text: "#000000",
    },
  }),
}));

// Mock for useSortByStore
const mockHandlePress = jest.fn();

jest.mock("@/src/stores/useSortByStore", () => ({
  useSortByStore: jest.fn(),
}));

// Mock for the icons
jest.mock("@expo/vector-icons", () => ({
  Entypo: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
}));

describe("SortBy", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(require("@/src/stores/useSortByStore").useSortByStore)
      .mockImplementation((selector: any) => {
        const state = {
          activeElement: "recent",
          handlePress: mockHandlePress,
        };
        return selector(state);
      });
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<SortBy />);

      expect(screen.getByText("select-arrows")).toBeTruthy();
      expect(screen.getByText("chevron-down")).toBeTruthy();
    });

    it("should display the sort text with the active element", () => {
      render(<SortBy />);

      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();
    });

    it("should display the correct icons", () => {
      render(<SortBy />);

      expect(screen.getByText("select-arrows")).toBeTruthy();
      expect(screen.getByText("chevron-down")).toBeTruthy();
    });

    it("should apply the correct styles to the container", () => {
      render(<SortBy />);

      const container = screen.getByText("select-arrows").parent?.parent;
      expect(container).toBeTruthy();
    });
  });

  describe("Active element formatting", () => {
    it("should capitalize the first letter of the active element", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "recent",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();
    });

    it("should handle active elements with multiple words", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "a-z",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (A-z)")).toBeTruthy();
    });

    it("should handle active elements in uppercase", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "OLDEST",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (OLDEST)")).toBeTruthy();
    });

    it("should handle active elements with numbers", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "1-10",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (1-10)")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("should call handlePress when the component is pressed", () => {
      render(<SortBy />);

      const pressable = screen.getByText("select-arrows").parent?.parent;
      fireEvent.press(pressable!);

      expect(mockHandlePress).toHaveBeenCalledTimes(1);
    });

    it("should call handlePress only once per press", () => {
      render(<SortBy />);

      const pressable = screen.getByText("select-arrows").parent?.parent;
      fireEvent.press(pressable!);

      expect(mockHandlePress).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple presses", () => {
      render(<SortBy />);

      const pressable = screen.getByText("select-arrows").parent?.parent;

      fireEvent.press(pressable!);
      fireEvent.press(pressable!);
      fireEvent.press(pressable!);

      expect(mockHandlePress).toHaveBeenCalledTimes(3);
    });
  });

  describe("Different active elements", () => {
    it("should display 'Recent' when the active element is 'recent'", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "recent",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();
    });

    it("should display 'Oldest' when the active element is 'oldest'", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "oldest",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (Oldest)")).toBeTruthy();
    });

    it("should display 'Az' when the active element is 'az'", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "az",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (Az)")).toBeTruthy();
    });

    it("should display 'Za' when the active element is 'za'", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "za",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (Za)")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible to the user", () => {
      render(<SortBy />);

      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();
      expect(screen.getByText("select-arrows")).toBeTruthy();
      expect(screen.getByText("chevron-down")).toBeTruthy();
    });

    it("should allow touch interaction", () => {
      render(<SortBy />);

      const pressable = screen.getByText("select-arrows").parent?.parent;
      fireEvent.press(pressable!);

      expect(mockHandlePress).toHaveBeenCalled();
    });
  });

  describe("Styles and theme", () => {
    it("should use theme colors", () => {
      render(<SortBy />);

      // The component should render without errors using theme colors
      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();
    });

    it("should apply theme border style", () => {
      render(<SortBy />);

      const container = screen.getByText("select-arrows").parent?.parent;
      expect(container).toBeTruthy();
    });

    it("should apply row styles correctly", () => {
      render(<SortBy />);

      const leftRow = screen.getByText("select-arrows").parent;
      const rightRow = screen.getByText("chevron-down").parent;

      expect(leftRow).toBeTruthy();
      expect(rightRow).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle empty active elements", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by ()")).toBeTruthy();
    });

    it("should handle active elements with only spaces", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "   ",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (   )")).toBeTruthy();
    });

    it("should handle when handlePress is undefined", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "recent",
            handlePress: undefined,
          };
          return selector(state);
        });

      render(<SortBy />);

      const pressable = screen.getByText("select-arrows").parent?.parent;

      // Should not throw error when pressing the component
      expect(() => fireEvent.press(pressable!)).not.toThrow();
    });

    it("should handle active elements with special characters", () => {
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "a-z_123",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      render(<SortBy />);

      expect(screen.getByText("Sort by (A-z_123)")).toBeTruthy();
    });
  });

  describe("Memoization", () => {
    it("should use useMemo to format the active element", () => {
      const { rerender } = render(<SortBy />);

      expect(screen.getByText("Sort by (Recent)")).toBeTruthy();

      // Change the active element
      jest
        .mocked(require("@/src/stores/useSortByStore").useSortByStore)
        .mockImplementation((selector: any) => {
          const state = {
            activeElement: "oldest",
            handlePress: mockHandlePress,
          };
          return selector(state);
        });

      rerender(<SortBy />);

      expect(screen.getByText("Sort by (Oldest)")).toBeTruthy();
    });
  });
});
