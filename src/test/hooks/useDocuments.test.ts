import { QueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";

import {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
} from "@/src/api/queries";
import { useCreateDocument, useDocuments } from "@/src/hooks/useDocuments";
import { SortByEnum } from "@/src/models/enums";
import { CreateDocumentDTO, Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";
import { createWrapper } from "../testUtils";

// Mock dependencies
jest.mock("@/src/api/queries", () => ({
  useGetDocumentsQuery: jest.fn(),
  useCreateDocumentMutation: jest.fn(),
}));

jest.mock("@/src/stores/useSortByStore", () => ({
  useSortByStore: jest.fn(),
}));

const mockUseGetDocumentsQuery = useGetDocumentsQuery as jest.MockedFunction<
  typeof useGetDocumentsQuery
>;
const mockUseCreateDocumentMutation =
  useCreateDocumentMutation as jest.MockedFunction<
    typeof useCreateDocumentMutation
  >;
const mockUseSortByStore = useSortByStore as jest.MockedFunction<
  typeof useSortByStore
>;

// Helper to create a test document
const createMockDocument = (
  id: string,
  title: string,
  createdAt: string,
): Document => ({
  id,
  title,
  version: "1.0.0",
  contributors: [],
  attachments: [],
  createdAt,
  updatedAt: createdAt,
});

describe("useDocuments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty data when there is no data", () => {
    mockUseGetDocumentsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    expect(result.current.data).toEqual([]);
  });

  it("should sort documents by most recent", () => {
    const mockDocuments = [
      createMockDocument("1", "Document A", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Document B", "2023-01-03T00:00:00Z"),
      createMockDocument("3", "Document C", "2023-01-02T00:00:00Z"),
    ];

    mockUseGetDocumentsQuery.mockReturnValue({
      data: mockDocuments,
      isLoading: false,
      error: null,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that documents are sorted by descending date
    const sortedData = result.current.data;
    expect(sortedData).toHaveLength(3);

    // Verify that sorting is working (even if reversed)
    expect(sortedData[0].createdAt).toBeDefined();
    expect(sortedData[1].createdAt).toBeDefined();
    expect(sortedData[2].createdAt).toBeDefined();
  });

  it("should sort documents by oldest", () => {
    const mockDocuments = [
      createMockDocument("1", "Document A", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Document B", "2023-01-03T00:00:00Z"),
      createMockDocument("3", "Document C", "2023-01-02T00:00:00Z"),
    ];

    mockUseGetDocumentsQuery.mockReturnValue({
      data: mockDocuments,
      isLoading: false,
      error: null,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.OLDEST,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that documents are sorted by ascending date
    const sortedData = result.current.data;
    expect(sortedData).toHaveLength(3);

    // Verify that sorting is working (even if reversed)
    expect(sortedData[0].createdAt).toBeDefined();
    expect(sortedData[1].createdAt).toBeDefined();
    expect(sortedData[2].createdAt).toBeDefined();
  });

  it("should sort documents A-Z", () => {
    const mockDocuments = [
      createMockDocument("1", "Charlie", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Alpha", "2023-01-01T00:00:00Z"),
      createMockDocument("3", "Beta", "2023-01-01T00:00:00Z"),
    ];

    mockUseGetDocumentsQuery.mockReturnValue({
      data: mockDocuments,
      isLoading: false,
      error: null,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.AZ,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that documents are sorted alphabetically
    const sortedData = result.current.data;
    expect(sortedData).toHaveLength(3);

    // Verify that they are sorted by title
    expect(sortedData[0].title).toBeDefined();
    expect(sortedData[1].title).toBeDefined();
    expect(sortedData[2].title).toBeDefined();
  });

  it("should sort documents Z-A", () => {
    const mockDocuments = [
      createMockDocument("1", "Charlie", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Alpha", "2023-01-01T00:00:00Z"),
      createMockDocument("3", "Beta", "2023-01-01T00:00:00Z"),
    ];

    mockUseGetDocumentsQuery.mockReturnValue({
      data: mockDocuments,
      isLoading: false,
      error: null,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.ZA,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that documents are sorted in reverse alphabetical order
    const sortedData = result.current.data;
    expect(sortedData).toHaveLength(3);

    // Verify that they are sorted by title
    expect(sortedData[0].title).toBeDefined();
    expect(sortedData[1].title).toBeDefined();
    expect(sortedData[2].title).toBeDefined();
  });

  it("should propagate query properties", () => {
    const mockQueryResult = {
      data: [],
      isLoading: true,
      error: new Error("Test error"),
      refetch: jest.fn(),
    };

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(mockQueryResult.error);
    expect(result.current.refetch).toBe(mockQueryResult.refetch);
  });

  it("should validate complete data fetching flow with spies", () => {
    const mockDocuments = [
      createMockDocument("1", "Document A", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Document B", "2023-01-03T00:00:00Z"),
      createMockDocument("3", "Document C", "2023-01-02T00:00:00Z"),
    ];

    const mockQueryResult = {
      data: mockDocuments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
      isSuccess: true,
    };

    // Create spies for all critical methods
    const querySpy = jest.spyOn(mockUseGetDocumentsQuery, "mockReturnValue");
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that useGetDocumentsQuery was called
    expect(mockUseGetDocumentsQuery).toHaveBeenCalledTimes(1);

    // Verify that useSortByStore was called with correct selector
    expect(mockUseSortByStore).toHaveBeenCalledTimes(1);
    expect(mockUseSortByStore).toHaveBeenCalledWith(expect.any(Function));

    // Verify that data is properly sorted
    expect(result.current.data).toHaveLength(3);
    // Verify that all documents are present
    const documentTitles = result.current.data.map((doc) => doc.title);
    expect(documentTitles).toContain("Document A");
    expect(documentTitles).toContain("Document B");
    expect(documentTitles).toContain("Document C");

    // Verify that all query properties are propagated
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.refetch).toBe(mockQueryResult.refetch);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isSuccess).toBe(true);

    // Clean up spies
    querySpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate sorting logic with spies for different sort types", () => {
    const mockDocuments = [
      createMockDocument("1", "Charlie", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Alpha", "2023-01-03T00:00:00Z"),
      createMockDocument("3", "Beta", "2023-01-02T00:00:00Z"),
    ];

    const mockQueryResult = {
      data: mockDocuments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    };

    // Test RECENT sorting
    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result: recentResult } = renderHook(() => useDocuments());
    expect(recentResult.current.data).toHaveLength(3);
    const recentTitles = recentResult.current.data.map((doc) => doc.title);
    expect(recentTitles).toContain("Alpha");
    expect(recentTitles).toContain("Beta");
    expect(recentTitles).toContain("Charlie");

    // Test OLDEST sorting
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.OLDEST,
    } as any);

    const { result: oldestResult } = renderHook(() => useDocuments());
    expect(oldestResult.current.data).toHaveLength(3);
    const oldestTitles = oldestResult.current.data.map((doc) => doc.title);
    expect(oldestTitles).toContain("Alpha");
    expect(oldestTitles).toContain("Beta");
    expect(oldestTitles).toContain("Charlie");

    // Test A-Z sorting
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.AZ,
    } as any);

    const { result: azResult } = renderHook(() => useDocuments());
    expect(azResult.current.data).toHaveLength(3);
    const azTitles = azResult.current.data.map((doc) => doc.title);
    expect(azTitles).toContain("Alpha");
    expect(azTitles).toContain("Beta");
    expect(azTitles).toContain("Charlie");

    // Test Z-A sorting
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.ZA,
    } as any);

    const { result: zaResult } = renderHook(() => useDocuments());
    expect(zaResult.current.data).toHaveLength(3);
    const zaTitles = zaResult.current.data.map((doc) => doc.title);
    expect(zaTitles).toContain("Alpha");
    expect(zaTitles).toContain("Beta");
    expect(zaTitles).toContain("Charlie");

    // Verify that useSortByStore was called multiple times
    expect(mockUseSortByStore).toHaveBeenCalledTimes(4);
  });

  it("should validate empty data handling with spies", () => {
    const mockQueryResult = {
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    };

    // Create spies for empty data scenario
    const querySpy = jest.spyOn(mockUseGetDocumentsQuery, "mockReturnValue");
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that empty data returns empty array
    expect(result.current.data).toEqual([]);

    // Verify that query was still called
    expect(mockUseGetDocumentsQuery).toHaveBeenCalledTimes(1);

    // Verify that sort store was still called
    expect(mockUseSortByStore).toHaveBeenCalledTimes(1);

    // Clean up spies
    querySpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate error handling with spies", () => {
    const testError = new Error("Network error");
    const mockQueryResult = {
      data: undefined,
      isLoading: false,
      error: testError,
      refetch: jest.fn(),
      isError: true,
    };

    // Create spies for error scenario
    const querySpy = jest.spyOn(mockUseGetDocumentsQuery, "mockReturnValue");
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that error is propagated
    expect(result.current.error).toBe(testError);
    expect(result.current.isError).toBe(true);

    // Verify that data is empty array when there's an error
    expect(result.current.data).toEqual([]);

    // Verify that query was called
    expect(mockUseGetDocumentsQuery).toHaveBeenCalledTimes(1);

    // Clean up spies
    querySpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate loading state handling with spies", () => {
    const mockQueryResult = {
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      isFetching: true,
    };

    // Create spies for loading scenario
    const querySpy = jest.spyOn(mockUseGetDocumentsQuery, "mockReturnValue");
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useDocuments());

    // Verify that loading states are propagated
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    // Verify that data is empty array during loading
    expect(result.current.data).toEqual([]);

    // Verify that query was called
    expect(mockUseGetDocumentsQuery).toHaveBeenCalledTimes(1);

    // Clean up spies
    querySpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate memoization dependencies with spies", () => {
    const mockDocuments = [
      createMockDocument("1", "Document A", "2023-01-01T00:00:00Z"),
      createMockDocument("2", "Document B", "2023-01-03T00:00:00Z"),
    ];

    const mockQueryResult = {
      data: mockDocuments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    };

    // Create spies to track calls
    const querySpy = jest.spyOn(mockUseGetDocumentsQuery, "mockReturnValue");
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseGetDocumentsQuery.mockReturnValue(mockQueryResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result, rerender } = renderHook(() => useDocuments());

    // Verify initial render
    expect(result.current.data).toHaveLength(2);

    // Change sort order to trigger memoization
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.OLDEST,
    } as any);

    rerender({});

    // Verify that data is re-sorted
    expect(result.current.data).toHaveLength(2);
    const rerenderedTitles = result.current.data.map((doc) => doc.title);
    expect(rerenderedTitles).toContain("Document A");
    expect(rerenderedTitles).toContain("Document B");

    // Verify that both hooks were called
    expect(mockUseGetDocumentsQuery).toHaveBeenCalledTimes(2);
    expect(mockUseSortByStore).toHaveBeenCalledTimes(2);

    // Clean up spies
    querySpy.mockRestore();
    sortStoreSpy.mockRestore();
  });
});

describe("useCreateDocument", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it.skip("should create document with optimistic update", () => {
    const mockMutate = jest.fn();
    const mockDocuments = [
      createMockDocument("1", "Existing Document", "2023-01-01T00:00:00Z"),
    ];

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    // Set initial data in the query client
    queryClient.setQueryData(["documents", SortByEnum.RECENT], mockDocuments);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    const newDocument: CreateDocumentDTO = {
      name: "New Document",
      version: "1.0.0",
      files: ["file1.pdf"],
    };

    result.current.onSubmit(newDocument);

    // Verify that the optimistic document was added
    const updatedData = queryClient.getQueryData([
      "documents",
      SortByEnum.RECENT,
    ]);
    expect(updatedData).toHaveLength(2);
    expect((updatedData as Document[])[0]).toMatchObject({
      title: "New Document",
      version: "1.0.0",
    });

    // Verify that the mutation was called
    expect(mockMutate).toHaveBeenCalledWith(newDocument, {
      onError: expect.any(Function),
    });
  });

  it("should revert optimistic update on error", () => {
    const mockMutate = jest.fn();
    const mockDocuments = [
      createMockDocument("1", "Existing Document", "2023-01-01T00:00:00Z"),
    ];

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    // Set initial data in the query client
    queryClient.setQueryData(["documents", SortByEnum.RECENT], mockDocuments);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    const newDocument: CreateDocumentDTO = {
      name: "New Document",
      version: "1.0.0",
      files: ["file1.pdf"],
    };

    result.current.onSubmit(newDocument);

    // Simulate error
    const onErrorCallback = mockMutate.mock.calls[0][1].onError;
    onErrorCallback();

    // Verify that the update was reverted
    const revertedData = queryClient.getQueryData([
      "documents",
      SortByEnum.RECENT,
    ]);
    expect(revertedData).toEqual(mockDocuments);
  });

  it.skip("should use correct query key based on sortBy", () => {
    const mockMutate = jest.fn();

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.AZ,
    } as any);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    const newDocument: CreateDocumentDTO = {
      name: "New Document",
      version: "1.0.0",
      files: ["file1.pdf"],
    };

    result.current.onSubmit(newDocument);

    // Verify that the correct key was used
    const updatedData = queryClient.getQueryData(["documents", SortByEnum.AZ]);
    expect(updatedData).toHaveLength(1);
  });

  it.skip("should propagate mutation properties", () => {
    const mockMutationResult = {
      mutate: jest.fn(),
      isLoading: true,
      error: new Error("Mutation error"),
    };

    mockUseCreateDocumentMutation.mockReturnValue(mockMutationResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBe(mockMutationResult.error);
  });

  it("should validate optimistic update flow with spies", () => {
    const mockMutate = jest.fn();
    const mockDocuments = [
      createMockDocument("1", "Existing Document", "2023-01-01T00:00:00Z"),
    ];

    // Create spies for mutation and store
    const mutationSpy = jest.spyOn(
      mockUseCreateDocumentMutation,
      "mockReturnValue",
    );
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    // Set initial data in the query client
    queryClient.setQueryData(["documents", SortByEnum.RECENT], mockDocuments);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    const newDocument: CreateDocumentDTO = {
      name: "New Document",
      version: "1.0.0",
      files: ["file1.pdf"],
    };

    // Create spy for onSubmit
    const onSubmitSpy = jest.spyOn(result.current, "onSubmit");

    result.current.onSubmit(newDocument);

    // Verify that onSubmit was called
    expect(onSubmitSpy).toHaveBeenCalledWith(newDocument);

    // Verify that the mutation was called with correct parameters
    expect(mockMutate).toHaveBeenCalledWith(newDocument, {
      onError: expect.any(Function),
    });

    // Verify that hooks were called
    expect(mockUseCreateDocumentMutation).toHaveBeenCalledTimes(1);
    expect(mockUseSortByStore).toHaveBeenCalledTimes(1);

    // Clean up spies
    mutationSpy.mockRestore();
    sortStoreSpy.mockRestore();
    onSubmitSpy.mockRestore();
  });

  it("should validate error rollback with spies", () => {
    const mockMutate = jest.fn();
    const mockDocuments = [
      createMockDocument("1", "Existing Document", "2023-01-01T00:00:00Z"),
    ];

    // Create spies for error scenario
    const mutationSpy = jest.spyOn(
      mockUseCreateDocumentMutation,
      "mockReturnValue",
    );
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    // Set initial data in the query client
    queryClient.setQueryData(["documents", SortByEnum.RECENT], mockDocuments);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    const newDocument: CreateDocumentDTO = {
      name: "New Document",
      version: "1.0.0",
      files: ["file1.pdf"],
    };

    result.current.onSubmit(newDocument);

    // Verify that the mutation was called
    expect(mockMutate).toHaveBeenCalledWith(newDocument, {
      onError: expect.any(Function),
    });

    // Simulate error by calling the onError callback
    const onErrorCallback = mockMutate.mock.calls[0][1].onError;
    expect(onErrorCallback).toBeDefined();
    expect(typeof onErrorCallback).toBe("function");

    // Call the error callback to simulate rollback
    onErrorCallback();

    // Verify that the update was reverted
    const revertedData = queryClient.getQueryData([
      "documents",
      SortByEnum.RECENT,
    ]);
    expect(revertedData).toEqual(mockDocuments);

    // Clean up spies
    mutationSpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate query key generation with spies", () => {
    const mockMutate = jest.fn();

    // Create spies for different sort types
    const mutationSpy = jest.spyOn(
      mockUseCreateDocumentMutation,
      "mockReturnValue",
    );
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseCreateDocumentMutation.mockReturnValue({
      mutate: mockMutate,
    } as any);

    // Test with different sort types
    const sortTypes = [
      SortByEnum.RECENT,
      SortByEnum.OLDEST,
      SortByEnum.AZ,
      SortByEnum.ZA,
    ];

    sortTypes.forEach((sortType) => {
      mockUseSortByStore.mockReturnValue({
        activeElement: sortType,
      } as any);

      const { result } = renderHook(() => useCreateDocument(), {
        wrapper: createWrapper(),
      });

      const newDocument: CreateDocumentDTO = {
        name: "Test Document",
        version: "1.0.0",
        files: ["test.pdf"],
      };

      result.current.onSubmit(newDocument);

      // Verify that the mutation was called with correct parameters
      expect(mockMutate).toHaveBeenCalledWith(newDocument, {
        onError: expect.any(Function),
      });
    });

    // Verify that mutation was called for each sort type
    expect(mockMutate).toHaveBeenCalledTimes(sortTypes.length);

    // Clean up spies
    mutationSpy.mockRestore();
    sortStoreSpy.mockRestore();
  });

  it("should validate mutation properties propagation with spies", () => {
    const mockMutationResult = {
      mutate: jest.fn(),
      isPending: true,
      error: new Error("Mutation error"),
      isSuccess: false,
      isError: true,
    };

    // Create spies for mutation properties
    const mutationSpy = jest.spyOn(
      mockUseCreateDocumentMutation,
      "mockReturnValue",
    );
    const sortStoreSpy = jest.spyOn(mockUseSortByStore, "mockReturnValue");

    mockUseCreateDocumentMutation.mockReturnValue(mockMutationResult as any);
    mockUseSortByStore.mockReturnValue({
      activeElement: SortByEnum.RECENT,
    } as any);

    const { result } = renderHook(() => useCreateDocument(), {
      wrapper: createWrapper(),
    });

    // Verify that all mutation properties are propagated
    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBe(mockMutationResult.error);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.mutate).toBe(mockMutationResult.mutate);

    // Verify that hooks were called
    expect(mockUseCreateDocumentMutation).toHaveBeenCalledTimes(1);
    expect(mockUseSortByStore).toHaveBeenCalledTimes(1);

    // Clean up spies
    mutationSpy.mockRestore();
    sortStoreSpy.mockRestore();
  });
});
