export type Document = {
  id: string;
  title: string;
  version: string;
  contributors: Contributor[];
  attachments: string[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type Contributor = {
  id: string;
  name: string;
};

export type CreateDocumentDTO = { name: string; version: string; fileUrl: string };

export type User = {
  id: string;
  name: string;
  email: string;
};
