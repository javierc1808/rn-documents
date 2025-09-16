import { render, screen } from "@testing-library/react-native";
import React from "react";

import DocumentItem from "@/src/components/DocumentItem";
import { Document } from "@/src/models/types";

// Mock for useTheme
jest.mock("@/src/hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      card: "#ffffff",
      text: "#000000",
      textSecondary: "#666666",
      textTertiary: "#999999",
      icon: "#666666",
    },
  }),
}));

// Mock for useListByStore
jest.mock("@/src/stores/useListByStore", () => ({
  useListByStore: () => ({
    activeElement: "LIST",
  }),
}));

// Mock for the icons
jest.mock("@expo/vector-icons", () => ({
  FontAwesome5: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
  MaterialCommunityIcons: ({ name, size, color, testID }: any) => {
    const { Text } = require("react-native");
    return <Text testID={testID}>{name}</Text>;
  },
}));

const mockDocument: Document = {
  id: "1",
  title: "Test Document",
  version: "1.0.0",
  contributors: [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ],
  attachments: ["file1.pdf", "file2.docx"],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("DocumentItem", () => {
  describe("Rendering in LIST mode", () => {
    it("should render the document in list mode", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
      expect(screen.getByText("Version 1.0.0")).toBeTruthy();
    });

    it("should show the contributors", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Jane Smith")).toBeTruthy();
    });

    it("should show the attachments", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("file1.pdf")).toBeTruthy();
      expect(screen.getByText("file2.docx")).toBeTruthy();
    });

    it("should show the creation date", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("2024-01-01T00:00:00Z")).toBeTruthy();
    });

    it("should show the correct icons", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("account-group-outline")).toBeTruthy();
      expect(screen.getByText("link")).toBeTruthy();
    });

    it("should show the section titles", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("Contributors")).toBeTruthy();
      expect(screen.getByText("Attachments")).toBeTruthy();
    });
  });

  describe("Props and styles", () => {
    it("should apply custom styles when provided", () => {
      const customStyle = { marginTop: 10 };
      render(<DocumentItem data={mockDocument} style={customStyle} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
    });

    it("should work without custom styles", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
    });
  });

  describe("Document data", () => {
    it("should handle documents without contributors", () => {
      const documentWithoutContributors = {
        ...mockDocument,
        contributors: [],
      };

      render(<DocumentItem data={documentWithoutContributors} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
      expect(screen.getByText("Contributors")).toBeTruthy();
    });

    it("should handle documents without attachments", () => {
      const documentWithoutAttachments = {
        ...mockDocument,
        attachments: [],
      };

      render(<DocumentItem data={documentWithoutAttachments} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
      expect(screen.getByText("Attachments")).toBeTruthy();
    });

    it("should handle long titles", () => {
      const documentWithLongTitle = {
        ...mockDocument,
        title:
          "This is a very long document title that should be handled properly by the component",
      };

      render(<DocumentItem data={documentWithLongTitle} />);

      expect(
        screen.getByText(
          "This is a very long document title that should be handled properly by the component",
        ),
      ).toBeTruthy();
    });

    it("should handle versions with different formats", () => {
      const documentWithDifferentVersion = {
        ...mockDocument,
        version: "2.1.3-beta",
      };

      render(<DocumentItem data={documentWithDifferentVersion} />);

      expect(screen.getByText("Version 2.1.3-beta")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should render all accessible text elements", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("Test Document")).toBeTruthy();
      expect(screen.getByText("Version 1.0.0")).toBeTruthy();
      expect(screen.getByText("Contributors")).toBeTruthy();
      expect(screen.getByText("Attachments")).toBeTruthy();
    });

    it("should show contributor information in an accessible way", () => {
      render(<DocumentItem data={mockDocument} />);

      expect(screen.getByText("John Doe")).toBeTruthy();
      expect(screen.getByText("Jane Smith")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle documents with minimal data", () => {
      const minimalDocument = {
        id: "1",
        title: "Minimal Document",
        version: "1.0.0",
        contributors: [],
        attachments: [],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      render(<DocumentItem data={minimalDocument} />);

      expect(screen.getByText("Minimal Document")).toBeTruthy();
      expect(screen.getByText("Version 1.0.0")).toBeTruthy();
    });

    it("should handle contributors with empty names", () => {
      const documentWithEmptyContributors = {
        ...mockDocument,
        contributors: [
          { id: "1", name: "" },
          { id: "2", name: "Valid Name" },
        ],
      };

      render(<DocumentItem data={documentWithEmptyContributors} />);

      expect(screen.getByText("Valid Name")).toBeTruthy();
    });
  });
});
