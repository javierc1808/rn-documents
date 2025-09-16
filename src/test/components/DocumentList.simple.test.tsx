import { render, screen } from "@testing-library/react-native";
import React from "react";
import DocumentList from "../../components/DocumentList";

// Simple mock for the hooks
jest.mock("../../hooks/useDocumentList", () => ({
  useDocumentList: () => ({
    itemWidth: 200,
    rowHeight: 150,
    onMeasureItem: jest.fn(),
    isGrid: false,
    columns: 1,
    contentContainerStyle: {
      paddingHorizontal: 16,
      paddingTop: 0,
      paddingBottom: 0,
    },
    isAnimating: false,
    handleAnimationComplete: jest.fn(),
  }),
}));

jest.mock("../../hooks/useDocumentListLogic", () => ({
  useDocumentListLogic: () => ({
    items: [],
    hasHydrated: true,
    lastSyncAt: Date.now(),
    networkStatus: "ok" as const,
    errorMessage: undefined,
    isRefetching: false,
    isFetching: false,
    isInitialLoad: false,
    shouldShowLoading: true,
    refetch: jest.fn(),
    setItems: jest.fn(),
    setNetworkError: jest.fn(),
    clearNetworkError: jest.fn(),
  }),
}));

describe("DocumentList Simple", () => {
  it("should render without errors", () => {
    expect(() => render(<DocumentList />)).not.toThrow();
  });

  it("should show the loading state", () => {
    render(<DocumentList />);
    expect(screen.getByTestId("activity-indicator")).toBeTruthy();
  });
});
