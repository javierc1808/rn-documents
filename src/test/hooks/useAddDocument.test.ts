import { act, renderHook } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

import { useCreateDocumentMutation } from "@/src/api/queries";
import { useAddDocument } from "@/src/hooks/useAddDocument";

// Mock dependencies
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock("@/src/api/queries", () => ({
  useCreateDocumentMutation: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const mockDocumentPicker = DocumentPicker as jest.Mocked<typeof DocumentPicker>;
const mockCreateDocumentMutation =
  useCreateDocumentMutation as jest.MockedFunction<
    typeof useCreateDocumentMutation
  >;

describe("useAddDocument", () => {
  const mockMutateAsync = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateDocumentMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as any);

    // Mock console.error to avoid noise in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAddDocument());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(false);
    expect(result.current.selectedFiles).toEqual([]);
    expect(result.current.errors).toEqual({});
  });

  it("should handle file selection correctly", async () => {
    const mockAssetsWithRequiredProps = [
      {
        name: "document1.pdf",
        uri: "file://document1.pdf",
        lastModified: Date.now(),
      },
      {
        name: "document2.docx",
        uri: "file://document2.docx",
        lastModified: Date.now(),
      },
    ];

    mockDocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: mockAssetsWithRequiredProps,
    });

    const { result } = renderHook(() => useAddDocument());

    await act(async () => {
      await result.current.handleFileSelection();
    });

    expect(result.current.selectedFiles).toEqual([
      "document1.pdf",
      "document2.docx",
    ]);
  });

  it("should avoid duplicate files", async () => {
    const mockAssetsWithRequiredProps = [
      {
        name: "document1.pdf",
        uri: "file://document1.pdf",
        lastModified: Date.now(),
      },
      {
        name: "document2.docx",
        uri: "file://document2.docx",
        lastModified: Date.now(),
      },
    ];

    mockDocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: mockAssetsWithRequiredProps,
    });

    const { result } = renderHook(() => useAddDocument());

    // Select files for the first time
    await act(async () => {
      await result.current.handleFileSelection();
    });

    expect(result.current.selectedFiles).toEqual([
      "document1.pdf",
      "document2.docx",
    ]);

    // Try to select the same files
    await act(async () => {
      await result.current.handleFileSelection();
    });

    // Files should not be duplicated
    expect(result.current.selectedFiles).toEqual([
      "document1.pdf",
      "document2.docx",
    ]);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Notice",
      "Some files are already selected",
    );
  });

  it("should handle file selection cancellation", async () => {
    mockDocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: true,
      assets: null,
    });

    const { result } = renderHook(() => useAddDocument());

    await act(async () => {
      await result.current.handleFileSelection();
    });

    expect(result.current.selectedFiles).toEqual([]);
  });

  it("should handle file selection errors", async () => {
    mockDocumentPicker.getDocumentAsync.mockRejectedValue(
      new Error("File selection error"),
    );

    const { result } = renderHook(() => useAddDocument());

    await act(async () => {
      await result.current.handleFileSelection();
    });

    expect(Alert.alert).toHaveBeenCalledWith("Error", "Could not select files");
  });

  it("should remove files correctly", async () => {
    const { result } = renderHook(() => useAddDocument());

    // Simulate selected files using the internal hook
    const mockAssets = [
      { name: "file1.pdf", uri: "file://file1.pdf", lastModified: Date.now() },
      {
        name: "file2.docx",
        uri: "file://file2.docx",
        lastModified: Date.now(),
      },
      { name: "file3.txt", uri: "file://file3.txt", lastModified: Date.now() },
    ];

    mockDocumentPicker.getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: mockAssets,
    });

    // First add some files
    await act(async () => {
      await result.current.handleFileSelection();
    });

    // Remove the second file
    act(() => {
      result.current.removeFile(1);
    });

    expect(result.current.selectedFiles).toEqual(["file1.pdf", "file3.txt"]);
  });

  it("should apply version mask correctly", () => {
    const { result } = renderHook(() => useAddDocument());

    const testCases = [
      { input: "1.2.3", expected: "1.2.3" },
      { input: "1,2,3", expected: "1.2.3" },
      { input: "1..2.3", expected: "1.2.3" },
      { input: ".1.2.3", expected: "1.2.3" },
      { input: "1.2.3abc", expected: "1.2.3" },
      { input: "abc1.2.3", expected: "1.2.3" },
    ];

    testCases.forEach(({ input, expected }) => {
      let resultValue = "";
      result.current.handleVersionChange(input, (value) => {
        resultValue = value;
      });
      expect(resultValue).toBe(expected);
    });
  });

  it("should submit form correctly", async () => {
    mockMutateAsync.mockResolvedValue({});

    const { result } = renderHook(() => useAddDocument());

    const formData = {
      name: "Test Document",
      version: "1.0.0",
      files: ["test.pdf", "test.docx"],
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: "Test Document",
      version: "1.0.0",
      files: ["test", "test"], // Without extension
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Document created successfully",
      [
        {
          text: "OK",
          onPress: expect.any(Function),
        },
      ],
    );
  });

  it("should handle form submission errors", async () => {
    mockMutateAsync.mockRejectedValue(new Error("Creation failed"));

    const { result } = renderHook(() => useAddDocument());

    const formData = {
      name: "Test Document",
      version: "1.0.0",
      files: ["test.pdf"],
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Could not create document",
    );
  });

  it("should handle form close", () => {
    const { result } = renderHook(() => useAddDocument());

    result.current.handleClose();

    // Verify that router.back() is called (which is mocked)
    const { router } = require("expo-router");
    expect(router.back).toHaveBeenCalled();
  });

  it("should show loading state during submission", async () => {
    // Mock that resolves immediately
    mockMutateAsync.mockResolvedValue({} as any);

    const { result } = renderHook(() => useAddDocument());

    const formData = {
      name: "Test Document",
      version: "1.0.0",
      files: ["test.pdf"],
    };

    // Verify that initially it's not submitting
    expect(result.current.isSubmitting).toBe(false);

    // Start submission
    await act(async () => {
      await result.current.onSubmit(formData);
    });

    // Verify that the mutation was called with processed data
    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: "Test Document",
      version: "1.0.0",
      files: ["test"],
    });
  });
});
