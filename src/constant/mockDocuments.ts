import { Document } from "@/src/models/types";

export const mockDocuments: Document[] = [
  {
    attachments: ["European Amber Lager", "Wood-aged Beer"],
    contributors: [
      {
        id: "1b41861e-51e2-4bf4-ba13-b20f01ce81ef",
        name: "Jasen Crona",
      },
      {
        id: "2a1d6ed0-7d2d-4dc6-b3ea-436a38fd409e",
        name: "Candace Jaskolski",
      },
      {
        id: "9ae28565-4a1c-42e3-9ae8-e39e6f783e14",
        name: "Rosemarie Schaden",
      },
    ],
    createdAt: "1912-03-08T06:01:39.382278739Z",
    id: "69517c79-a4b2-4f64-9c83-20e5678e4519",
    title: "Arrogant Bastard Ale",
    updatedAt: "1952-02-29T22:21:13.817038244Z",
    version: "5.3.15",
  },
  {
    attachments: ["Strong Ale", "Stout", "Dark Lager", "Belgian Strong Ale"],
    contributors: [
      {
        id: "1bbb6853-390f-49aa-a002-fb60908f8b0e",
        name: "Hermann Lowe",
      },
    ],
    createdAt: "1993-11-12T00:55:44.438198299Z",
    id: "d7e00994-75e6-48f1-b778-e5d31ead7136",
    title: "Ten FIDY",
    updatedAt: "1946-04-15T06:09:44.564202073Z",
    version: "5.1.15",
  },
  {
    attachments: [
      "Bock",
      "English Pale Ale",
      "Wood-aged Beer",
      "Belgian And French Ale",
    ],
    contributors: [
      {
        id: "de30f704-1102-40f4-8517-a0361378370c",
        name: "Velda Watsica",
      },
      {
        id: "f65b8ce0-1276-4a07-899c-a41387c9360c",
        name: "Helmer Hauck",
      },
    ],
    createdAt: "2007-12-11T02:35:33.701912202Z",
    id: "fe6ad6ed-a5bd-480b-8688-fd3652b2a6d9",
    title: "Orval Trappist Ale",
    updatedAt: "1972-01-02T13:12:29.948799707Z",
    version: "1.3.1",
  },
];
