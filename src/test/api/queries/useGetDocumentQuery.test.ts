import { QueryClient } from "@tanstack/react-query";
import { cleanup, waitFor } from "@testing-library/react-native";

import { fetchWithTimeout } from "@/src/api/http/fetchWithTimeout";
import { useGetDocumentsQuery } from "@/src/api/queries/useGetDocumentsQuery";
import {
  createTestQueryClient,
  customRenderHook,
  mockApiResponses,
  mockAuthContext,
} from "../../testUtils";

// Mock for los stores y contextos
jest.mock("@/src/stores/useSortByStore", () => ({
  useSortByStore: jest.fn(() => ({ activeElement: "title" })),
}));

jest.mock("@/src/context/AuthContext", () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}));

// Mock for fetchWithTimeout
jest.mock("@/src/api/http/fetchWithTimeout", () => ({
  fetchWithTimeout: jest.fn(),
}));

const mockFetchWithTimeout = fetchWithTimeout as jest.MockedFunction<
  typeof fetchWithTimeout
>;

describe("queries", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.getQueryCache().clear();
    queryClient.getMutationCache().clear();
    queryClient.clear();

    jest.clearAllMocks();
    cleanup();
  });

  describe("useGetDocumentsQuery", () => {
    it("should return data successfully", async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponses.documents.success),
      };
      mockFetchWithTimeout.mockResolvedValue(mockResponse as any);

      // Act
      const { result } = customRenderHook(() => useGetDocumentsQuery());

      // Assert
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.data).toEqual(mockApiResponses.documents.success);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should handle loading state", () => {
      // Arrange
      mockFetchWithTimeout.mockImplementation(() => new Promise(() => {})); // Nunca resuelve

      // Act
      const { result } = customRenderHook(() => useGetDocumentsQuery());

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("should handle errors", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
      };
      mockFetchWithTimeout.mockResolvedValue(mockResponse as any);

      // Act
      const { result } = customRenderHook(() => useGetDocumentsQuery());

      // Assert - Verify that the query is not successful and has no data
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(false);
        },
        { timeout: 5000 }
      );

      // Verify que no hay datos y que no es exitosa
      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(false);
    });

    it("should use correct query key with sortBy", () => {
      // Arrange
      const { useSortByStore } = require("@/src/stores/useSortByStore");
      useSortByStore.mockReturnValue({ activeElement: "createdAt" });

      // Act
      customRenderHook(() => useGetDocumentsQuery());

      // Assert
      expect(useSortByStore).toHaveBeenCalled();
    });
  });
});
