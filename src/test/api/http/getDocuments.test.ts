
import { fetchWithTimeout } from "@/src/api/http/fetchWithTimeout";
import { getDocuments } from "@/src/api/http/getDocument";
import {
  mockApiResponses,
} from "../../testUtils";

// Mock for fetchWithTimeout
jest.mock("@/src/api/http/fetchWithTimeout", () => ({
  fetchWithTimeout: jest.fn(),
}));

const mockFetchWithTimeout = fetchWithTimeout as jest.MockedFunction<
  typeof fetchWithTimeout
>;

describe("http", () => {
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
        }
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
        "Error to contact the server."
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
});
