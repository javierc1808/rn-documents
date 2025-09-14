import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { useAuthContext } from "@/src/context/AuthContext";
import { SortByEnum } from "@/src/models/enums";
import { CreateDocumentDTO, Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

const getDocuments = async (authToken: string): Promise<Document[]> => {
  const res = await fetch("http://localhost:8080/documents", {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export const useDocuments = () => {
  const { authToken } = useAuthContext();
  const sortBy = useSortByStore((state) => state.activeElement);

  const query = useQuery({
    queryKey: ["documents", sortBy],
    queryFn: () => getDocuments(authToken),
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });

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

const createDocument = async (
  authToken: string,
  document: CreateDocumentDTO
): Promise<Document> => {
  const res = await fetch("http://localhost:8080/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(document),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};

export const useCreateDocument = () => {
  const { authToken } = useAuthContext();
  const sortBy = useSortByStore((state) => state.activeElement);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (document: CreateDocumentDTO) =>
      createDocument(authToken, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });

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
