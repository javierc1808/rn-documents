import { renderHook } from "@testing-library/react-native";
import { useDocumentListLogic } from "../../hooks/useDocumentListLogic";
import { useDocuments } from "../../hooks/useDocuments";
import { Document } from "../../models/types";
import { useDocumentsStore } from "../../stores/useDocumentsStore";

// Mock for los hooks y stores
jest.mock("../../hooks/useDocuments");
jest.mock("../../stores/useDocumentsStore");

const mockUseDocuments = useDocuments as jest.MockedFunction<
  typeof useDocuments
>;
const mockUseDocumentsStore = useDocumentsStore as jest.MockedFunction<
  typeof useDocumentsStore
>;

describe("useDocumentListLogic", () => {
  const mockSetItems = jest.fn();
  const mockSetNetworkError = jest.fn();
  const mockClearNetworkError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock forl store
    mockUseDocumentsStore.mockImplementation((selector) => {
      const state = {
        items: [],
        hasHydrated: true,
        lastSyncAt: Date.now(),
        networkStatus: "ok" as const,
        errorMessage: undefined,
        setItems: mockSetItems,
        upsertItems: jest.fn(),
        setNetworkError: mockSetNetworkError,
        clearNetworkError: mockClearNetworkError,
        markHydrated: jest.fn(),
      };
      return selector(state);
    });
  });

  it("should sincronizar los datos del query con el store", () => {
    const mockData: Document[] = [
      {
        id: "1",
        title: "Document 1",
        version: "1.0",
        contributors: [],
        attachments: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Document 2",
        version: "1.0",
        contributors: [],
        attachments: [],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ];

    mockUseDocuments.mockReturnValue({
      data: mockData,
      isRefetching: false,
      refetch: jest.fn(),
      error: null,
      isFetching: false,
    } as any);

    renderHook(() => useDocumentListLogic());

    expect(mockSetItems).toHaveBeenCalledWith(mockData);
  });

  it("should manejar errors de red correctamente", () => {
    const mockError = new Error("Network error");
    mockError.name = "NetworkError";

    mockUseDocuments.mockReturnValue({
      data: [],
      isRefetching: false,
      refetch: jest.fn(),
      error: mockError,
      isFetching: false,
    } as any);

    renderHook(() => useDocumentListLogic());

    expect(mockSetNetworkError).toHaveBeenCalledWith("Network error");
  });

  it("should manejar errors de timeout correctamente", () => {
    const mockError = new Error("Request timeout");
    mockError.name = "AbortError";

    mockUseDocuments.mockReturnValue({
      data: [],
      isRefetching: false,
      refetch: jest.fn(),
      error: mockError,
      isFetching: false,
    } as any);

    renderHook(() => useDocumentListLogic());

    expect(mockSetNetworkError).toHaveBeenCalledWith(
      "Timeout to contact the server.",
    );
  });

  it("should limpiar errors cuando no hay error", () => {
    mockUseDocuments.mockReturnValue({
      data: [],
      isRefetching: false,
      refetch: jest.fn(),
      error: null,
      isFetching: false,
    } as any);

    renderHook(() => useDocumentListLogic());

    expect(mockClearNetworkError).toHaveBeenCalled();
  });

  it("should determinar correctamente si es la carga inicial", () => {
    const mockItems: Document[] = [
      {
        id: "1",
        title: "Document 1",
        version: "1.0",
        contributors: [],
        attachments: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    mockUseDocumentsStore.mockImplementation((selector) => {
      const state = {
        items: mockItems,
        hasHydrated: true,
        lastSyncAt: Date.now(),
        networkStatus: "ok" as const,
        errorMessage: undefined,
        setItems: mockSetItems,
        upsertItems: jest.fn(),
        setNetworkError: mockSetNetworkError,
        clearNetworkError: mockClearNetworkError,
        markHydrated: jest.fn(),
      };
      return selector(state);
    });

    mockUseDocuments.mockReturnValue({
      data: mockItems,
      isRefetching: false,
      refetch: jest.fn(),
      error: null,
      isFetching: false,
    } as any);

    const { result } = renderHook(() => useDocumentListLogic());

    expect(result.current.isInitialLoad).toBe(true);
  });

  it("should determinar correctamente si debe mostrar loading", () => {
    // Caso 1: No hidratado
    mockUseDocumentsStore.mockImplementation((selector) => {
      const state = {
        items: [],
        hasHydrated: false,
        lastSyncAt: Date.now(),
        networkStatus: "ok" as const,
        errorMessage: undefined,
        setItems: mockSetItems,
        upsertItems: jest.fn(),
        setNetworkError: mockSetNetworkError,
        clearNetworkError: mockClearNetworkError,
        markHydrated: jest.fn(),
      };
      return selector(state);
    });

    mockUseDocuments.mockReturnValue({
      data: [],
      isRefetching: false,
      refetch: jest.fn(),
      error: null,
      isFetching: false,
    } as any);

    const { result: result1 } = renderHook(() => useDocumentListLogic());
    expect(result1.current.shouldShowLoading).toBe(true);

    // Caso 2: Hidratado pero sin items y fetching
    mockUseDocumentsStore.mockImplementation((selector) => {
      const state = {
        items: [],
        hasHydrated: true,
        lastSyncAt: Date.now(),
        networkStatus: "ok" as const,
        errorMessage: undefined,
        setItems: mockSetItems,
        upsertItems: jest.fn(),
        setNetworkError: mockSetNetworkError,
        clearNetworkError: mockClearNetworkError,
        markHydrated: jest.fn(),
      };
      return selector(state);
    });

    mockUseDocuments.mockReturnValue({
      data: [],
      isRefetching: false,
      refetch: jest.fn(),
      error: null,
      isFetching: true,
    } as any);

    const { result: result2 } = renderHook(() => useDocumentListLogic());
    expect(result2.current.shouldShowLoading).toBe(true);
  });
});
