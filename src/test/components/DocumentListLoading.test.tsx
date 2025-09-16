import { render, screen } from "@testing-library/react-native";
import React from "react";
import { DocumentListLoading } from "../../components/DocumentListLoading";

describe("DocumentListLoading", () => {
  it("should render the loading indicator", () => {
    render(<DocumentListLoading />);

    expect(screen.getByTestId("activity-indicator")).toBeTruthy();
  });

  it("should use the default 'large' size", () => {
    render(<DocumentListLoading />);

    const indicator = screen.getByTestId("activity-indicator");
    expect(indicator).toBeTruthy();
  });

  it("should use 'small' size when specified", () => {
    render(<DocumentListLoading size="small" />);

    const indicator = screen.getByTestId("activity-indicator");
    expect(indicator).toBeTruthy();
  });

  it("should center the indicator in the container", () => {
    render(<DocumentListLoading />);

    const container = screen.getByTestId("activity-indicator").parent;
    expect(container).toBeTruthy();
  });
});
