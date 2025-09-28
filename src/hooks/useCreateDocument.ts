import { useQueryClient } from "@tanstack/react-query";

import { useCreateDocumentMutation } from "@/src/api/queries/useCreateDocumentMutation";
import { CreateDocumentDTO, Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

export const getOptimisticData = (document: CreateDocumentDTO) => {
  const datetime = new Date().toISOString();

  return {
    id: `tmp-${Date.now()}`,
    createdAt: datetime,
    contributors: [],
    attachments: [],
    title: document.name,
    version: document.version,
    updatedAt: datetime,
  } as Document;
};

export const useCreateDocument = () => {
  const sortBy = useSortByStore((state) => state.activeElement);
  // const { sortBy } = useGlobalSortBy();
  const queryClient = useQueryClient();

  const mutation = useCreateDocumentMutation();

  const onSubmit = (document: CreateDocumentDTO) => {
    const key = ["documents", sortBy];
    const prevData = queryClient.getQueryData<Document[]>(key) ?? [];

    const optimisticData = getOptimisticData(document);

    queryClient.setQueryData(key, [optimisticData, ...prevData]);

    mutation.mutate(document, {
      onError: () => queryClient.setQueryData(key, prevData),
    });
  };

  return {
    onSubmit,
    ...mutation,
  };
};
