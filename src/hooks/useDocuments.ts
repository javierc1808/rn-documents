import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCreateDocumentMutation, useGetDocumentsQuery } from "@/src/api/queries";
import { SortByEnum } from "@/src/models/enums";
import { CreateDocumentDTO, Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

export const useDocuments = () => {
  const sortBy = useSortByStore((state) => state.activeElement);
  const query = useGetDocumentsQuery();

  const sortedData = useMemo(() => {
    if (!query.data) return [];

    return query.data.sort((a, b) => {
      if (sortBy === SortByEnum.RECENT) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === SortByEnum.OLDEST) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === SortByEnum.AZ) {
        return a.title.localeCompare(b.title);
      }
      return b.title.localeCompare(a.title);
    });
  }, [query.data, sortBy]);

  return {
    ...query,
    data: sortedData,
  };
};

export const useCreateDocument = () => {
  const sortBy = useSortByStore((state) => state.activeElement);
  const queryClient = useQueryClient();

  const mutation = useCreateDocumentMutation();

  const onSubmit = (document: CreateDocumentDTO) => {
    const key = ["documents", sortBy];
    const prevData = queryClient.getQueryData<Document[]>(key) ?? [];

    const datetime = new Date().toISOString();

    const optimistic: Document = {
      id: `tmp-${Date.now()}`,
      createdAt: datetime,
      contributors: [],
      attachments: [],
      title: document.name,
      version: document.version,
      updatedAt: datetime,
    };

    queryClient.setQueryData(key, [optimistic, ...prevData]);

    mutation.mutate(document, {
      onError: () => queryClient.setQueryData(key, prevData),
    });
  };

  return {
    onSubmit,
    ...mutation,
  };
};
