import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  getDarkModeSettingQuery,
  getLearningProgressQuery,
  getRandomLearningTermQuery,
  getSetByIdQuery,
  getSetsQuery,
} from "../../providers/operation/queries";

export const getRootLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    // Dark mode
    const darkModeQuery = getDarkModeSettingQuery();

    if (darkModeQuery.queryKey) {
      queryClient.fetchQuery({ ...darkModeQuery });
    }

    return null;
  };

// Main loader
export const getAltMainLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    // Dark mode
    const darkModeQuery = getDarkModeSettingQuery();

    if (darkModeQuery.queryKey) {
      queryClient.fetchQuery({ ...darkModeQuery });
    }

    // Set
    const setQuery = getSetsQuery();

    if (setQuery.queryKey) {
      const sets = await queryClient.fetchQuery({
        ...setQuery,
      });

      // Term
      if (sets.length !== 0) {
        const setDetailQuery = getSetByIdQuery(sets[0].id);
        if (setDetailQuery.queryKey) {
          queryClient.fetchQuery({
            ...setDetailQuery,
          });
        }

        const randomLearningTermQuery = getRandomLearningTermQuery(sets[0].id);
        if (randomLearningTermQuery.queryKey) {
          queryClient.fetchQuery({ ...randomLearningTermQuery });
        }

        const learningProgressQuery = getLearningProgressQuery(sets[0].id);
        if (learningProgressQuery.queryKey) {
          queryClient.fetchQuery({ ...learningProgressQuery });
        }
      }
    }

    return null;
  };
