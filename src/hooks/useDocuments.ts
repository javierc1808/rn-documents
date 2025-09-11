import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { SortByEnum } from "@/src/models/enums";
import { Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

const getDocuments = async (): Promise<Document[]> => {
  const res = await fetch("http://localhost:8080/documents");
  return res.json();
};

export const useDocuments = () => {
  const sortBy = useSortByStore((state) => state.activeElement);

  const query = useQuery({
    queryKey: ["documents", sortBy],
    queryFn: getDocuments,
    staleTime: 30_000
  });

  const sortedData = useMemo(() => {
    if (!query.data) return [];

    return query.data.sort((a, b) => {
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
    })

  }, [query.data, sortBy]);

  return {
    ...query,
    data: sortedData,
  };
};