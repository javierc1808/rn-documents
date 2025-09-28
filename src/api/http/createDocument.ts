import { faker } from "@faker-js/faker";

import handleResponse from "@/src/api/http/handleResponse";
import { CreateDocumentDTO, Document, User } from "@/src/models/types";

const _getDocumentToCreate = (document: CreateDocumentDTO, user: User) => {
  return {
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
  } as Omit<Document, "updatedAt">;
};

const _getHeaders = (authToken: string) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${authToken}`,
  };
};

export const createDocument = async (
  user: User,
  authToken: string,
  document: CreateDocumentDTO,
): Promise<Document> => {
  const documentToCreate = _getDocumentToCreate(document, user);

  const url = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(url + "/documents", {
    method: "POST",
    headers: _getHeaders(authToken),
    body: JSON.stringify(documentToCreate),
  });

  return await handleResponse(response);
};
