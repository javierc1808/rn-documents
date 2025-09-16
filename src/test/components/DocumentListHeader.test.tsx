import { render, screen } from "@testing-library/react-native";
import React from "react";
import { DocumentListHeader } from "../../components/DocumentListHeader";

describe("DocumentListHeader", () => {
  it("should show the sync state when networkStatus is 'ok'", () => {
    const lastSyncAt = Date.now();
    render(<DocumentListHeader networkStatus="ok" lastSyncAt={lastSyncAt} />);

    expect(screen.getByText(/Last sync:/)).toBeTruthy();
  });

  it("should show '—' when lastSyncAt is undefined", () => {
    render(<DocumentListHeader networkStatus="ok" lastSyncAt={undefined} />);

    expect(screen.getByText("Last sync: —")).toBeTruthy();
  });

  it("should show the error message when networkStatus is 'error'", () => {
    const errorMessage = "Connection error";
    render(
      <DocumentListHeader networkStatus="error" errorMessage={errorMessage} />,
    );

    expect(screen.getByText(errorMessage)).toBeTruthy();
    expect(screen.getByText("Pull to try again")).toBeTruthy();
  });

  it("should show the idle state when networkStatus is 'idle'", () => {
    render(<DocumentListHeader networkStatus="idle" />);

    expect(screen.getByText(/Last sync:/)).toBeTruthy();
  });
});
