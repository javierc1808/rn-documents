import { fetchWithTimeout } from "@/src/api/http/fetchWithTimeout";
import handleResponse from "@/src/api/http/handleResponse";
import { Document } from "@/src/models/types";

const _getHeaders = (authToken: string) => {
  return {
    Accept: "application/json",
    Authorization: `Basic ${authToken}`,
  };
};

export const getDocuments = async (authToken: string): Promise<Document[]> => {
  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await fetchWithTimeout(url + "/documents", 8000, {
    headers: _getHeaders(authToken),
  });

  return await handleResponse(response);
};
