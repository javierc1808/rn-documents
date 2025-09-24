import { useAuthContext } from "@/src/context/AuthContext";
import { CreateDocumentDTO, Document, User } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";
import { faker } from "@faker-js/faker";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchWithTimeout } from "./fetchWithTimeout";

export const getDocuments = async (authToken: string): Promise<Document[]> => {
  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetchWithTimeout(url + "/documents", 8000, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authToken}`,
    },
  });

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error("Error to contact the server.");
    }

    throw new Error(await res.text());
  }

  return res.json();
};

export const createDocument = async (
  user: User,
  authToken: string,
  document: CreateDocumentDTO,
): Promise<Document> => {
  const documentToCreate: Omit<Document, "updatedAt"> = {
    id: faker.string.uuid(),
    createdAt: new Date().toISOString(),
    contributors: [
      {
        id: user.id,
        name: user.name,
      },
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      },
    ],
    attachments: document.files,
    title: document.name,
    version: document.version,
  };

  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  const res = await fetch(url + "/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify(documentToCreate),
  });

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error("Error to contact the server.");
    }

    throw new Error(await res.text());
  }

  return res.json();
};

export const useGetDocumentsQuery = (): UseQueryResult<Document[], Error> => {
  const sortBy = useSortByStore((state) => state.activeElement);
  const { authToken } = useAuthContext();

  return useQuery({
    queryKey: ["documents", sortBy],
    queryFn: () => getDocuments(authToken),
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateDocumentMutation = (): UseMutationResult<
  Document,
  Error,
  CreateDocumentDTO
> => {
  const { user, authToken } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: CreateDocumentDTO) =>
      createDocument(user!, authToken, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.error("Error in mutation:", error);
    },
  });
};
