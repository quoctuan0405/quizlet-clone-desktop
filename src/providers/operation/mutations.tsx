import { QueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { Descendant } from "slate";
import {
  DarkModeSetting,
  getDarkModeSettingQuery,
  getLearningProgressQuery,
  getRandomLearningTermQuery,
  getSetsQuery,
} from "./queries";
import { DARK_MODE } from "./type";

export interface Record {
  id: string;
}

// Learning
export interface ReportLearningProgressVariable {
  termId: string;
  isCorrect: boolean;
}

export const reportLearningProgressMutation = () => ({
  mutationFn: async ({ termId, isCorrect }: ReportLearningProgressVariable) => {
    return invoke("report_learning_progress_cmd", {
      termId,
      isCorrect,
    });
  },
});

export interface ResetLearningVariable {
  setId: string;
}

export const resetLearningMutation = (queryClient: QueryClient) => ({
  mutationFn: async ({ setId }: ResetLearningVariable) => {
    return invoke("reset_learning_cmd", {
      setId,
    });
  },
  onSuccess: (
    data: unknown,
    { setId }: ResetLearningVariable,
    context: unknown
  ) => {
    queryClient.invalidateQueries(getLearningProgressQuery(setId).queryKey);
    queryClient.invalidateQueries(getRandomLearningTermQuery(setId).queryKey);
  },
});

// Set
export interface TermPayload {
  question: Descendant[] | string;
  answer: Descendant[] | string;
  explanation?: Descendant[] | string;
}

export interface UpdateSetPayload {
  id: string;
  name: string;
  description?: string;
  terms: TermPayload[];
}

export const updateSetMutation = () => ({
  mutationFn: async (setPayload: UpdateSetPayload) => {
    return invoke<Record>("update_set_cmd", {
      setPayload,
    });
  },
});

export interface CreateSetPayload {
  name: string;
  description?: string;
  terms: TermPayload[];
}

export const createSetMutation = (queryClient: QueryClient) => ({
  mutationFn: async (setPayload: CreateSetPayload) => {
    return invoke<Record>("create_set_cmd", {
      setPayload,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(getSetsQuery().queryKey);
  },
});

export interface DeleteSetPayload {
  setId: string;
}

export const deleteSetMutation = (queryClient: QueryClient) => ({
  mutationFn: async ({ setId }: DeleteSetPayload) => {
    return invoke("delete_set_cmd", {
      setId,
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(getSetsQuery().queryKey);
  },
});

// Setting
export interface SettingPayload {
  key: string;
  value: any;
}

export const updateSetting = (queryClient: QueryClient) => ({
  mutationFn: async (settingPayload: SettingPayload) => {
    return invoke("update_setting_cmd", {
      setting: settingPayload,
    });
  },
  onSuccess: (data: unknown, variable: SettingPayload, context: unknown) => {
    queryClient.setQueryData(getDarkModeSettingQuery().queryKey, () => {
      const result: DarkModeSetting = {
        key: DARK_MODE,
        value: variable.value,
      };

      return result;
    });
  },
});
