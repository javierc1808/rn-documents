import { useAuthContext } from "@/src/context/AuthContext";
import { CreateDocumentDTO, Document, User } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";
import { faker } from "@faker-js/faker";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

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
  user: User,
  authToken: string,
  document: CreateDocumentDTO
): Promise<Document> => {

  const documentToCreate : Omit<Document, "updatedAt"> = {
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
  const { user, authToken } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: CreateDocumentDTO) =>
      createDocument(user!, authToken, document),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};