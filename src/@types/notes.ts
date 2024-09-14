type TCreateUpdateNoteBody = {
  title?: string;
  text?: string;
};

type TUpdateNoteParams = {
  id: string;
};

export type { TCreateUpdateNoteBody, TUpdateNoteParams };
