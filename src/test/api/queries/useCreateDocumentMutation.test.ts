import { QueryClient } from "@tanstack/react-query";
import { cleanup, waitFor } from "@testing-library/react-native";

import { useCreateDocumentMutation } from "@/src/api/queries/useCreateDocumentMutation";
import {
  createTestQueryClient,
  customRenderHook,
  mockApiResponses,
  mockAuthContext,
  mockCreateDocumentDTO,
} from "../../testUtils";

jest.mock("@/src/context/AuthContext", () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}));

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

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
        { timeout: 5000 }
      );

      expect(result.current.data).toEqual(
        mockApiResponses.createDocument.success
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
        { timeout: 1000 }
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
        { timeout: 5000 }
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
        { timeout: 5000 }
      );

      // Verify que la mutación fue exitosa
      expect(result.current.data).toEqual(
        mockApiResponses.createDocument.success
      );
    });
  });
});
