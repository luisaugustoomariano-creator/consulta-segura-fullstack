export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR" | "AUDITOR";
  agencyName: string;
};

export type Match = {
  id: string;
  fullName: string;
  city: string;
  state: string;
  company: string;
  role: string;
  documentMasked: string;
  emailMasked?: string;
  phoneMasked?: string;
  motherName?: string;
  fatherName?: string;
  sourceName: string;
  confidenceScore: number;
};

export type AuditSearch = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  query: string;
  purpose: string;
  resultCount: number;
  ipAddress?: string;
  createdAt: string;
};
