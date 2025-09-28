import { createDocument } from "@/src/api/http/createDocument";
import {
  mockApiResponses,
  mockCreateDocumentDTO,
  mockUser,
} from "../../testUtils";

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("http", () => {
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
        mockCreateDocumentDTO
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
        }
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
        createDocument(mockUser, "mock-token", mockCreateDocumentDTO)
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
        createDocument(mockUser, "mock-token", mockCreateDocumentDTO)
      ).rejects.toThrow("Validation Error");
    });
  });
});
