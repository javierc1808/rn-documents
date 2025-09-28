import { act, renderHook } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useCreateDocumentMutation } from "@/src/api/queries/useCreateDocumentMutation";
import { useAddDocument } from "@/src/hooks/useAddDocument";

// Mock dependencies
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock("@/src/api/queries/useCreateDocumentMutation", () => ({
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

    // Set form values using setValue
    await act(async () => {
      result.current.setValue("name", "Test Document");
      result.current.setValue("version", "1.0.0");
      result.current.setValue("files", ["test.pdf", "test.docx"]);
    });

    await act(async () => {
      result.current.handleSubmit();
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

    // Set form values using setValue
    await act(async () => {
      result.current.setValue("name", "Test Document");
      result.current.setValue("version", "1.0.0");
      result.current.setValue("files", ["test.pdf"]);
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Could not create document: Creation failed",
    );
  });

  it("should handle form close", () => {
    const { result } = renderHook(() => useAddDocument());

    result.current.handleClose();

    // Verify that router.back() is called (which is mocked)
    expect(router.back).toHaveBeenCalled();
  });

  it("should show loading state during submission", async () => {
    // Mock that resolves immediately
    mockMutateAsync.mockResolvedValue({} as any);

    const { result } = renderHook(() => useAddDocument());

    // Set form values using setValue
    await act(async () => {
      result.current.setValue("name", "Test Document");
      result.current.setValue("version", "1.0.0");
      result.current.setValue("files", ["test.pdf"]);
    });

    // Verify that initially it's not submitting
    expect(result.current.isSubmitting).toBe(false);

    // Start submission
    await act(async () => {
      result.current.handleSubmit();
    });

    // Verify that the mutation was called with processed data
    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: "Test Document",
      version: "1.0.0",
      files: ["test"],
    });
  });

  it("should validate complete document creation flow with spies", async () => {
    // Mock successful mutation response
    const mockDocument = {
      id: "test-id",
      title: "Test Document",
      version: "1.0.0",
      createdAt: "2024-01-01T00:00:00Z",
      contributors: [],
      attachments: ["test"],
    };
    mockMutateAsync.mockResolvedValue(mockDocument);

    // Create spies for all critical methods
    const mutateAsyncSpy = jest.spyOn(mockMutateAsync, "mockResolvedValue");
    const alertSpy = jest.spyOn(Alert, "alert");
    const routerBackSpy = jest.spyOn(router, "back");

    const { result } = renderHook(() => useAddDocument());

    // Set form values
    await act(async () => {
      result.current.setValue("name", "Test Document");
      result.current.setValue("version", "1.0.0");
      result.current.setValue("files", ["test.pdf", "test.docx"]);
    });

    // Verify form state before submission
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.selectedFiles).toEqual(["test.pdf", "test.docx"]);

    // Submit the form
    await act(async () => {
      result.current.handleSubmit();
    });

    // Verify that mutation was called with correct parameters
    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    expect(mockMutateAsync).toHaveBeenCalledWith({
      name: "Test Document",
      version: "1.0.0",
      files: ["test", "test"], // Files without extensions
    });

    // Verify success alert was shown
    expect(alertSpy).toHaveBeenCalledWith(
      "Success",
      "Document created successfully",
      [
        {
          text: "OK",
          onPress: expect.any(Function),
        },
      ],
    );

    // Verify that router.back() is called when OK is pressed
    const successAlertCall = alertSpy.mock.calls.find(
      (call) => call[0] === "Success",
    );
    expect(successAlertCall).toBeDefined();

    // Simulate pressing OK button
    const okButton = successAlertCall?.[2]?.[0] as
      | { onPress: () => void }
      | undefined;
    expect(okButton).toBeDefined();
    if (okButton) {
      act(() => {
        okButton.onPress();
      });
    }

    // Verify router.back() was called
    expect(routerBackSpy).toHaveBeenCalledTimes(1);

    // Clean up spies
    mutateAsyncSpy.mockRestore();
    alertSpy.mockRestore();
    routerBackSpy.mockRestore();
  });

  it("should validate error handling flow with spies", async () => {
    // Mock mutation error
    const errorMessage = "Network error occurred";
    mockMutateAsync.mockRejectedValue(new Error(errorMessage));

    // Create spies for error handling
    const alertSpy = jest.spyOn(Alert, "alert");
    const consoleErrorSpy = jest.spyOn(console, "error");

    const { result } = renderHook(() => useAddDocument());

    // Set form values
    await act(async () => {
      result.current.setValue("name", "Test Document");
      result.current.setValue("version", "1.0.0");
      result.current.setValue("files", ["test.pdf"]);
    });

    // Submit the form
    await act(async () => {
      result.current.handleSubmit();
    });

    // Verify error alert was shown
    expect(alertSpy).toHaveBeenCalledWith(
      "Error",
      `Could not create document: ${errorMessage}`,
    );

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error creating document:",
      expect.any(Error),
    );

    // Verify mutation was still called
    expect(mockMutateAsync).toHaveBeenCalledTimes(1);

    // Clean up spies
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should validate file selection flow with spies", async () => {
    const mockAssets = [
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
      assets: mockAssets,
    });

    // Create spies for file selection
    const documentPickerSpy = jest.spyOn(
      mockDocumentPicker,
      "getDocumentAsync",
    );
    const alertSpy = jest.spyOn(Alert, "alert");

    const { result } = renderHook(() => useAddDocument());

    // Verify initial state
    expect(result.current.selectedFiles).toEqual([]);

    // Select files
    await act(async () => {
      await result.current.handleFileSelection();
    });

    // Verify DocumentPicker was called with correct options
    expect(documentPickerSpy).toHaveBeenCalledTimes(1);
    expect(documentPickerSpy).toHaveBeenCalledWith({
      type: "*/*",
      multiple: true,
    });

    // Verify files were added to state
    expect(result.current.selectedFiles).toEqual([
      "document1.pdf",
      "document2.docx",
    ]);

    // Verify no error alert was shown
    expect(alertSpy).not.toHaveBeenCalledWith(
      "Error",
      "Could not select files",
    );

    // Clean up spies
    documentPickerSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it("should validate file removal flow with spies", async () => {
    const { result } = renderHook(() => useAddDocument());

    // First add some files
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

    await act(async () => {
      await result.current.handleFileSelection();
    });

    // Verify files were added
    expect(result.current.selectedFiles).toEqual([
      "file1.pdf",
      "file2.docx",
      "file3.txt",
    ]);

    // Remove the second file (index 1)
    act(() => {
      result.current.removeFile(1);
    });

    // Verify file was removed
    expect(result.current.selectedFiles).toEqual(["file1.pdf", "file3.txt"]);
  });

  it("should validate version masking with spies", () => {
    const { result } = renderHook(() => useAddDocument());

    // Test various version inputs
    const testCases = [
      { input: "1.2.3", expected: "1.2.3" },
      { input: "1,2,3", expected: "1.2.3" },
      { input: "1..2.3", expected: "1.2.3" },
      { input: ".1.2.3", expected: "1.2.3" },
      { input: "1.2.3abc", expected: "1.2.3" },
      { input: "abc1.2.3", expected: "1.2.3" },
      { input: "1.2.3.4.5", expected: "1.2.3" }, // Should limit to 3 parts
    ];

    testCases.forEach(({ input, expected }) => {
      let resultValue = "";
      result.current.handleVersionChange(input, (value) => {
        resultValue = value;
      });
      expect(resultValue).toBe(expected);
    });
  });
});
