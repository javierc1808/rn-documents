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

export type CreateDocumentDTO = { name: string; version: string; files: string[] };

export type User = {
  id: string;
  name: string;
  email: string;
};

export type NotificationMessage = {
  type: string;
  userName: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  timestamp: string;
};