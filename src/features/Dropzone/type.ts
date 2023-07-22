export type ColumnName = "index" | "id" | "term" | "definition" | "explanation";

export type ColumnMapper = {
  [key in number]: ColumnName;
};

export interface Options {
  addUniqueId: boolean;
}

export interface Term {
  id?: string;
  index?: number;
  question: string;
  answer: string;
  explanation?: string;
}

export interface Set {
  name: string;
  description: string;
  terms: Term[];
}

// Take a look at condition type at: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
export interface TermWithId {
  id: string;
  index?: number;
  question: string;
  answer: string;
  explanation?: string;
}

export interface SetWithTermWithId {
  name: string;
  description: string;
  terms: TermWithId[];
}

export interface OptionsAddUnqiueId {
  addUniqueId: true;
}

export interface OptionsNotAddUniqueId {
  addUniqueId: false;
}

export type SetResult<T extends OptionsAddUnqiueId | OptionsNotAddUniqueId> =
  T extends OptionsAddUnqiueId ? SetWithTermWithId : Set;
