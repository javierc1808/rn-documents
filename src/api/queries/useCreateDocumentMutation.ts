import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { createDocument } from "@/src/api/http/createDocument";
import { useAuthContext } from "@/src/context/AuthContext";
import { CreateDocumentDTO, Document } from "@/src/models/types";

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
