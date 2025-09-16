import { act, renderHook } from "@testing-library/react-native";
import { useDocumentsStore } from "../../stores/useDocumentsStore";

describe("useDocumentsStore", () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useDocumentsStore.getState().setItems([]);
    });
  });

  it("should initialize with an empty array of items", () => {
    const { result } = renderHook(() => useDocumentsStore());

    expect(result.current.items).toEqual([]);
  });

  it("should set items correctly", () => {
    const { result } = renderHook(() => useDocumentsStore());

    const mockItems = [
      {
        id: "1",
        title: "Document 1",
        version: "1.0",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        contributors: [],
        attachments: [],
      },
      {
        id: "2",
        title: "Document 2",
        version: "2.0",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        contributors: [],
        attachments: [],
      },
    ];

    act(() => {
      result.current.setItems(mockItems);
    });

    expect(result.current.items).toEqual(mockItems);
    expect(result.current.networkStatus).toBe("ok");
    expect(result.current.lastSyncAt).toBeDefined();
  });

  it("should update existing items with upsertItems", () => {
    const { result } = renderHook(() => useDocumentsStore());

    const initialItems = [
      {
        id: "1",
        title: "Document Original",
        version: "1.0",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        contributors: [],
        attachments: [],
      },
    ];

    act(() => {
      result.current.setItems(initialItems);
    });

    const updatedItems = [
      {
        id: "1",
        title: "Document Updated",
        version: "1.1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z",
        contributors: [],
        attachments: [],
      },
    ];

    act(() => {
      result.current.upsertItems(updatedItems);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe("Document Updated");
    expect(result.current.items[0].version).toBe("1.1");
  });

  it("should handle network errors", () => {
    const { result } = renderHook(() => useDocumentsStore());

    act(() => {
      result.current.setNetworkError("Connection error");
    });

    expect(result.current.networkStatus).toBe("error");
    expect(result.current.errorMessage).toBe("Connection error");
  });

  it("should clear network errors", () => {
    const { result } = renderHook(() => useDocumentsStore());

    act(() => {
      result.current.setNetworkError("Connection error");
    });

    act(() => {
      result.current.clearNetworkError();
    });

    expect(result.current.networkStatus).toBe("ok");
    expect(result.current.errorMessage).toBeUndefined();
  });

  it("should mark as hydrated", () => {
    const { result } = renderHook(() => useDocumentsStore());

    act(() => {
      result.current.markHydrated();
    });

    expect(result.current.hasHydrated).toBe(true);
  });
});
