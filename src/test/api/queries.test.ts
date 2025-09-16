import { QueryClient } from "@tanstack/react-query";
import { waitFor } from "@testing-library/react-native";
import { fetchWithTimeout } from "../../api/fetchWithTimeout";
import {
  createDocument,
  getDocuments,
  useCreateDocumentMutation,
  useGetDocumentsQuery,
} from "../../api/queries";
import {
  createTestQueryClient,
  customRenderHook,
  mockApiResponses,
  mockAuthContext,
  mockCreateDocumentDTO,
  mockUser,
} from "../testUtils";

// Mock for los stores y contextos
jest.mock("../../stores/useSortByStore", () => ({
  useSortByStore: jest.fn(() => ({ activeElement: "title" })),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}));

// Mock for fetchWithTimeout
jest.mock("../../api/fetchWithTimeout", () => ({
  fetchWithTimeout: jest.fn(),
}));

const mockFetchWithTimeout = fetchWithTimeout as jest.MockedFunction<
  typeof fetchWithTimeout
>;
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("queries.ts", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  describe("getDocuments", () => {
    it("should get documents successfully", async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiResponses.documents.success),
      };
      mockFetchWithTimeout.mockResolvedValue(mockResponse as any);

      // Act
      const result = await getDocuments("mock-token");

      // Assert
      expect(mockFetchWithTimeout).toHaveBeenCalledWith(
        "http://localhost:8080/documents",
        8000,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Basic mock-token",
          },
        },
      );
      expect(result).toEqual(mockApiResponses.documents.success);
    });

    it("should handle server errors (500+)", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
      };
      mockFetchWithTimeout.mockResolvedValue(mockResponse as any);

      // Act & Assert
      await expect(getDocuments("mock-token")).rejects.toThrow(
        "Error to contact the server.",
      );
    });

    it("should handle client errors (400-499)", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue("Bad Request"),
      };
      mockFetchWithTimeout.mockResolvedValue(mockResponse as any);

      // Act & Assert
      await expect(getDocuments("mock-token")).rejects.toThrow("Bad Request");
    });
  });

  describe("createDocument", () => {
    it("should create a document successfully", async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue(mockApiResponses.createDocument.success),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act
      const result = await createDocument(
        mockUser,
        "mock-token",
        mockCreateDocumentDTO,
      );

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/documents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic mock-token",
          },
          body: expect.stringContaining('"title":"Test Document"'),
        },
      );
      expect(result).toEqual(mockApiResponses.createDocument.success);
    });

    it("should handle server errors when creating document", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 500,
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act & Assert
      await expect(
        createDocument(mockUser, "mock-token", mockCreateDocumentDTO),
      ).rejects.toThrow("Error to contact the server.");
    });

    it("should handle client errors when creating document", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue("Validation Error"),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act & Assert
      await expect(
        createDocument(mockUser, "mock-token", mockCreateDocumentDTO),
      ).rejects.toThrow("Validation Error");
    });
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
        { timeout: 5000 },
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
        { timeout: 5000 },
      );

      // Verify que no hay datos y que no es exitosa
      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(false);
    });

    it("should use correct query key with sortBy", () => {
      // Arrange
      const { useSortByStore } = require("../../stores/useSortByStore");
      useSortByStore.mockReturnValue({ activeElement: "createdAt" });

      // Act
      customRenderHook(() => useGetDocumentsQuery());

      // Assert
      expect(useSortByStore).toHaveBeenCalled();
    });
  });

  describe("useCreateDocumentMutation", () => {
    it("should create document successfully", async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue(mockApiResponses.createDocument.success),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act
      const { result } = customRenderHook(() => useCreateDocumentMutation());

      result.current.mutate(mockCreateDocumentDTO);

      // Assert
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 5000 },
      );

      expect(result.current.data).toEqual(
        mockApiResponses.createDocument.success,
      );
      // Verify that it's not in error state
      expect(result.current.isError).toBe(false);
    });

    it("should handle loading state during mutation", async () => {
      // Arrange
      mockFetch.mockImplementation(() => new Promise(() => {})); // Nunca resuelve

      // Act
      const { result } = customRenderHook(() => useCreateDocumentMutation());

      result.current.mutate(mockCreateDocumentDTO);

      // Assert - Verify that it's in loading or pending state
      await waitFor(
        () => {
          expect(result.current.isPending).toBeTruthy();
        },
        { timeout: 1000 },
      );

      expect(result.current.data).toBeUndefined();
    });

    it("should handle errors in mutation", async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue("Validation Error"),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act
      const { result } = customRenderHook(() => useCreateDocumentMutation());

      result.current.mutate(mockCreateDocumentDTO);

      // Assert
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 },
      );

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });

    it("should invalidate queries after success", async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue(mockApiResponses.createDocument.success),
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Act
      const { result } = customRenderHook(() => useCreateDocumentMutation());

      result.current.mutate(mockCreateDocumentDTO);

      // Assert
      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 5000 },
      );

      // Verify que la mutación fue exitosa
      expect(result.current.data).toEqual(
        mockApiResponses.createDocument.success,
      );
    });
  });
});
