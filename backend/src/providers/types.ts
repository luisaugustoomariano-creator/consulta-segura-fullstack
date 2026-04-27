export type PersonSearchInput = {
  name: string;
  city?: string;
};

export type PersonMatch = {
  id: string;
  fullName: string;
  city: string;
  state: string;
  company: string;
  role: string;
  documentMasked: string;
  emailMasked?: string | null;
  phoneMasked?: string | null;
  motherName?: string | null;
  fatherName?: string | null;
  sourceName: string;
  confidenceScore: number;
};

export interface DataProvider {
  searchPeople(input: PersonSearchInput): Promise<PersonMatch[]>;
}
