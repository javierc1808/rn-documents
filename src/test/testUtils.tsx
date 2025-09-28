import { CreateDocumentDTO, Document, User } from "@/src/models/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from "@testing-library/react-native";
import React from "react";

// Jest mock to avoid type errors
const mockJest = {
  fn: () => jest.fn(),
  mock: () => jest.mock,
  clearAllMocks: () => jest.clearAllMocks,
};

// Mock data for testing
export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Document 1",
    version: "1.0",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    contributors: [{ id: "user1", name: "User 1" }],
    attachments: [],
  },
  {
    id: "2",
    title: "Document 2",
    version: "2.0",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    contributors: [{ id: "user2", name: "User 2" }],
    attachments: [],
  },
];

// Mock for documents store
export const mockDocumentsStore = {
  items: mockDocuments,
  hasHydrated: true,
  lastSyncAt: Date.now(),
  networkStatus: "ok" as const,
  errorMessage: undefined,
  setItems: mockJest.fn(),
  upsertItems: mockJest.fn(),
  setNetworkError: mockJest.fn(),
  clearNetworkError: mockJest.fn(),
  markHydrated: mockJest.fn(),
};

// Mock for useDocuments hook
export const mockUseDocuments = {
  data: mockDocuments,
  isRefetching: false,
  isFetching: false,
  refetch: mockJest.fn(),
  error: null,
};

// Mock for useDocumentList hook
export const mockUseDocumentList = {
  itemWidth: 200,
  rowHeight: 150,
  onMeasureItem: mockJest.fn(),
  isGrid: false,
  columns: 1,
  contentContainerStyle: { paddingHorizontal: 16 },
  isAnimating: false,
  handleAnimationComplete: mockJest.fn(),
};

// Create QueryClient for tests
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0, // Data is always considered stale
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom wrapper for testing with QueryClient
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Specific wrapper for TanStack Query hooks
export const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryWrapper";
  return Wrapper;
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Custom renderHook function for TanStack Query
export const customRenderHook = <T,>(
  hook: () => T,
  options?: Omit<RenderHookOptions<T>, "wrapper">,
) => {
  const wrapper = createWrapper();
  return renderHook(hook, { wrapper, ...options });
};

// Re-exportar todo
export * from "@testing-library/react-native";
export { customRender as render };

// Specific utilities for DocumentList testing
export const createMockDocumentListProps = (overrides = {}) => ({
  items: mockDocuments,
  networkStatus: "ok" as const,
  errorMessage: undefined,
  lastSyncAt: Date.now(),
  isRefetching: false,
  isFetching: false,
  isInitialLoad: true,
  shouldShowLoading: false,
  refetch: mockJest.fn(),
  setItems: mockJest.fn(),
  setNetworkError: mockJest.fn(),
  clearNetworkError: mockJest.fn(),
  ...overrides,
});

// Utilities for testing specific states
export const createErrorState = () => ({
  networkStatus: "error" as const,
  errorMessage: "Connection error",
  lastSyncAt: Date.now() - 30000, // 30 seconds ago
});

export const createLoadingState = () => ({
  shouldShowLoading: true,
  isFetching: true,
  items: [],
});

export const createEmptyState = () => ({
  items: [],
  hasHydrated: true,
  shouldShowLoading: false,
  isInitialLoad: false,
});

// Specific utilities for TanStack Query testing
export const mockUser: User = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
};

export const mockCreateDocumentDTO: CreateDocumentDTO = {
  name: "Test Document",
  version: "1.0",
  files: [],
};

export const mockAuthContext = {
  user: mockUser,
  authToken: "mock-auth-token",
  isAuthenticated: true,
  login: mockJest.fn(),
  logout: mockJest.fn(),
};

// Mock API responses
export const mockApiResponses = {
  documents: {
    success: mockDocuments,
    error: new Error("Server error"),
    networkError: new Error("Connection error"),
  },
  createDocument: {
    success: {
      id: "new-doc-123",
      title: "New Document",
      version: "1.0",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      contributors: [{ id: mockUser.id, name: mockUser.name }],
      attachments: [],
    },
    error: new Error("Error creating document"),
  },
};

// Utilities to simulate query states
export const createQuerySuccessState = (data: any) => ({
  data,
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

export const createQueryLoadingState = () => ({
  data: undefined,
  isLoading: true,
  isError: false,
  isSuccess: false,
  error: null,
});

export const createQueryErrorState = (error: Error) => ({
  data: undefined,
  isLoading: false,
  isError: true,
  isSuccess: false,
  error,
});

// Utilities to simulate mutation states
export const createMutationSuccessState = (data: any) => ({
  data,
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
});

export const createMutationLoadingState = () => ({
  data: undefined,
  isLoading: true,
  isError: false,
  isSuccess: false,
  error: null,
});

export const createMutationErrorState = (error: Error) => ({
  data: undefined,
  isLoading: false,
  isError: true,
  isSuccess: false,
  error,
});
