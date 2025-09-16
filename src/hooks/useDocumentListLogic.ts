import { useEffect } from "react";

import { useDocuments } from "@/src/hooks/useDocuments";
import { useDocumentsStore } from "@/src/stores/useDocumentsStore";

export interface DocumentListLogicReturn {
  // Data
  items: any[];
  hasHydrated: boolean;
  lastSyncAt?: number;
  networkStatus: "idle" | "ok" | "error";
  errorMessage?: string;
  
  // Loading states
  isRefetching: boolean;
  isFetching: boolean;
  isInitialLoad: boolean;
  shouldShowLoading: boolean;
  
  // Actions
  refetch: () => void;
  setItems: (items: any[]) => void;
  setNetworkError: (msg: string) => void;
  clearNetworkError: () => void;
}

export const useDocumentListLogic = (): DocumentListLogicReturn => {
  const { isRefetching, refetch, error, data, isFetching } = useDocuments();

  const items = useDocumentsStore((s) => s.items);
  const hasHydrated = useDocumentsStore((s) => s.hasHydrated);
  const lastSyncAt = useDocumentsStore((s) => s.lastSyncAt);
  const networkStatus = useDocumentsStore((s) => s.networkStatus);
  const errorMessage = useDocumentsStore((s) => s.errorMessage);

  const setItems = useDocumentsStore((s) => s.setItems);
  const setNetworkError = useDocumentsStore((s) => s.setNetworkError);
  const clearNetworkError = useDocumentsStore((s) => s.clearNetworkError);

  // Determine if it's the initial load (no previous data and not animating)
  const isInitialLoad = hasHydrated && items.length > 0;

  // Sync query data with store
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data, setItems]);

  useEffect(() => {
    if (error) {
      console.log("error", error.name, error.message);
      const msg = error.name === "AbortError"
        ? "Timeout to contact the server."
        : error.message || "Error to contact the server.";
      setNetworkError(msg);
    } else {
      clearNetworkError();
    }
  }, [error, setNetworkError, clearNetworkError]);

  const shouldShowLoading = !hasHydrated || (hasHydrated && items.length === 0 && isFetching);

  return {
    // Data
    items,
    hasHydrated,
    lastSyncAt,
    networkStatus,
    errorMessage,
    
    // Loading states
    isRefetching,
    isFetching,
    isInitialLoad,
    shouldShowLoading,
    
    // Actions
    refetch,
    setItems,
    setNetworkError,
    clearNetworkError,
  };
};
