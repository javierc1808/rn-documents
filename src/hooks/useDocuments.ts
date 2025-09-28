import { useMemo } from "react";

import { useGetDocumentsQuery } from "@/src/api/queries/useGetDocumentsQuery";
import { SortByEnum } from "@/src/models/enums";
import { Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

const _sortDataBy = (data: Document[], sortBy: SortByEnum) => {
  return data.sort((a, b) => {
    if (sortBy === SortByEnum.RECENT) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === SortByEnum.OLDEST) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === SortByEnum.AZ) {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });
};

export const useDocuments = () => {
  const sortBy = useSortByStore((state) => state.activeElement);
  // const { sortBy } = useGlobalSortBy();
  const query = useGetDocumentsQuery();

  const sortedData = useMemo(() => {
    if (!query.data) return [];

    return _sortDataBy(query.data, sortBy);
  }, [query.data, sortBy]);

  return {
    ...query,
    data: sortedData,
  };
};
