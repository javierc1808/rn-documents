import {
  useQuery,
  UseQueryResult
} from "@tanstack/react-query";

import { getDocuments } from "@/src/api/http/getDocument";
import { useAuthContext } from "@/src/context/AuthContext";
import { Document } from "@/src/models/types";
import { useSortByStore } from "@/src/stores/useSortByStore";

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