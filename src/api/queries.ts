import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useAuthContext } from "../context/AuthContext";
import { CreateDocumentDTO, Document } from "../models/types";
import { useSortByStore } from "../stores/useSortByStore";

const getDocuments = async (authToken: string): Promise<Document[]> => {
  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  const res = await fetch(url + "/documents", {
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

const createDocument = async (
  authToken: string,
  document: CreateDocumentDTO
): Promise<Document> => {
  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
  const res = await fetch(url + "/documents", {
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

export const useGetDocumentsQuery = () : UseQueryResult<Document[], Error> => {
  const sortBy = useSortByStore((state) => state.activeElement);
  const { authToken } = useAuthContext();

  return useQuery({
    queryKey: ["documents", sortBy],
    queryFn: () => getDocuments(authToken),
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });
};

export const useCreateDocumentMutation = () : UseMutationResult<Document, Error, CreateDocumentDTO> => {
  const { authToken } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: CreateDocumentDTO) =>
      createDocument(authToken, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};