import { useQuery } from "@tanstack/react-query";
import { Document } from "../models/types";

const getDocuments = async (): Promise<Document[]> => {
  const res = await fetch("http://localhost:8080/documents");
  return res.json();
};

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });
};