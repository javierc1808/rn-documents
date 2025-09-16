import { render, screen } from "@testing-library/react-native";
import React from "react";
import AnimatedDocumentItem from "../../components/AnimatedDocumentItem";

// Mock for the hooks
jest.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      card: "#FFFFFF",
      text: "#000000",
      textSecondary: "#666666",
      textTertiary: "#999999",
      icon: "#666666",
    },
  }),
}));

jest.mock("../../hooks/useAnimatedDocumentItem", () => ({
  useAnimatedDocumentItem: () => ({
    animatedStyle: {},
    isGridMode: false,
  }),
}));

jest.mock("../../utils/dateFormat", () => ({
  formatRelativeTime: () => "2 hours ago",
}));

const mockDocument = {
  id: "1",
  title: "Test document",
  version: "1.0",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  contributors: [
    { id: "user1", name: "User 1" },
    { id: "user2", name: "User 2" },
  ],
  attachments: ["file1.pdf", "file2.docx"],
};

describe("AnimatedDocumentItem", () => {
  it("should render the document title", () => {
    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("Test document")).toBeTruthy();
  });

  it("should render the document version", () => {
    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("Version 1.0")).toBeTruthy();
  });

  it("should render the contributors list", () => {
    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("Contributors")).toBeTruthy();
    expect(screen.getByText("User 1")).toBeTruthy();
    expect(screen.getByText("User 2")).toBeTruthy();
  });

  it("should render the attachments list", () => {
    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("Attachments")).toBeTruthy();
    expect(screen.getByText("file1.pdf")).toBeTruthy();
    expect(screen.getByText("file2.docx")).toBeTruthy();
  });

  it("should render the relative date", () => {
    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("2 hours ago")).toBeTruthy();
  });

  it("should render in grid mode when isGridMode is true", () => {
    // Mock for grid mode
    jest.doMock("../../hooks/useAnimatedDocumentItem", () => ({
      useAnimatedDocumentItem: () => ({
        animatedStyle: {},
        isGridMode: true,
      }),
    }));

    render(
      <AnimatedDocumentItem
        data={mockDocument}
        index={0}
        isAnimating={false}
      />,
    );

    expect(screen.getByText("Test document")).toBeTruthy();
    expect(screen.getByText("Version 1.0")).toBeTruthy();
  });
});
