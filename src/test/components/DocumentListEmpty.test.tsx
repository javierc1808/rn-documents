import { render, screen } from "@testing-library/react-native";
import React from "react";
import { DocumentListEmpty } from "../../components/DocumentListEmpty";

// Mock for hook useTheme
jest.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({
    colors: {
      textSecondary: "#666666",
    },
  }),
}));

describe("DocumentListEmpty", () => {
  it("should show the empty state message", () => {
    render(<DocumentListEmpty />);

    expect(screen.getByText("No documents found")).toBeTruthy();
  });

  it("should use the default vertical padding", () => {
    render(<DocumentListEmpty />);

    const container = screen.getByText("No documents found").parent;
    expect(container).toBeTruthy();
  });

  it("should use custom vertical padding", () => {
    render(<DocumentListEmpty paddingVertical={24} />);

    const container = screen.getByText("No documents found").parent;
    expect(container).toBeTruthy();
  });

  it("should center the text", () => {
    render(<DocumentListEmpty />);

    const container = screen.getByText("No documents found").parent;
    expect(container).toBeTruthy();
  });
});
