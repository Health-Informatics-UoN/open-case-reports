export type Concept = {
  concept_id: string;
//   name: string;
  count: number;
//   domain: string;
};

export type NoteNLP = {
  note_id: string;
  concept_id: string;
  concept_name?: string;
  lexical_variant: string;
  snippet: string;
  nlp_date: string;
  domain: string;
};

export type Note = {
  note_id: string;
  person_id?: string;
  note_date?: string;

};
