import { invoke } from "@tauri-apps/api/tauri";
import { QueryClient } from "@tanstack/react-query";
import { Descendant } from "slate";
import { DARK_MODE } from "./type";

// Major
interface Major {
  id: string;
  name: string;
  isDelete: boolean;
}

// Get signature from useQuery
export const getMajorsQuery = () => ({
  queryKey: ["majors"],
  queryFn: () => {
    return invoke<Major[]>("greet");
  },
  staleTime: 1000 * 60 * 2,
});

// Semester
interface Semester {
  id: string;
  name: string;
}

export const getSemestersQuery = () => ({
  queryKey: ["semesters"],
  queryFn: () => {
    return invoke<Semester[]>("get_semester_cmd");
  },
  staleTime: 1000 * 60 * 2,
});

// Term
interface Term {
  id: string;
  index?: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

export const getTermsQuery = (setId: string) => ({
  queryKey: ["terms", setId],
  queryFn: () => {
    return invoke<Term[]>("get_terms_cmd", { setId });
  },
  staleTime: 1000 * 60 * 2,
});

export interface Choice {
  question: string | Descendant[];
  answer: string | Descendant[];
}

export interface TermWithChoices {
  id: string;
  index: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  choices: Choice[];
  explanation?: string;
}

export const getRandomLearningTermQuery = (setId: string) => ({
  queryKey: ["random_learning_term", setId],
  queryFn: () => {
    return invoke<TermWithChoices>("get_random_learning_term_cmd", { setId });
  },
  staleTime: 1000 * 60 * 2,
});

interface LearningProgressResult {
  termsLearned: number;
  termsMastered: number;
  termsTotal: number;
}

export const getLearningProgressQuery = (setId: string) => ({
  queryKey: ["learning_progress", setId],
  queryFn: () => {
    return invoke<LearningProgressResult>("get_learning_progress_cmd", {
      setId,
    });
  },
  staleTime: 1000 * 60 * 2,
});

// Set
interface SetWithTermCount {
  id: string;
  name: string;
  description?: string;
  termCount: number;
}

export const getSetsQuery = () => ({
  queryKey: ["sets"],
  queryFn: () => {
    return invoke<SetWithTermCount[]>("get_sets_cmd");
  },
  staleTime: 1000 * 60 * 2,
});

interface SetWithListTerm {
  id: string;
  name: string;
  description?: string;
  terms: Term[];
}

export const getSetByIdQuery = (setId: string) => ({
  queryKey: ["set", setId],
  queryFn: () => {
    return invoke<SetWithListTerm>("get_set_by_id_cmd", { setId });
  },
  staleTime: 1000 * 60 * 2,
});

// Setting
export interface DarkModeSetting {
  key: string;
  value: boolean;
}

export const getDarkModeSettingQuery = () => ({
  queryKey: ["darkModeSetting"],
  queryFn: () => {
    return invoke<DarkModeSetting>("get_setting_cmd", { key: DARK_MODE });
  },
  staleTime: Infinity,
});

interface Setting {
  key: string;
  value: any;
}

export const getAllSettingsQuery = () => ({
  queryKey: ["settings"],
  queryFn: () => {
    return invoke<Setting[]>("get_all_settings_cmd");
  },
  staleTime: 1000 * 60 * 2,
});
