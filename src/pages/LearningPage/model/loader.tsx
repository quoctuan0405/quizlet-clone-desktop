import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import {
  getLearningProgressQuery,
  getRandomLearningTermQuery,
  getSetsQuery,
} from "../../../providers/operation/queries";
import { Params } from "../type";

export const getLearningPageLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { setId } = params as Params;

    const randomLearningTermQuery = getRandomLearningTermQuery(setId || "");
    if (randomLearningTermQuery.queryKey) {
      await queryClient.fetchQuery({ ...randomLearningTermQuery });
    }

    const learningProgressQuery = getLearningProgressQuery(setId || "");
    if (learningProgressQuery.queryKey) {
      await queryClient.fetchQuery({ ...learningProgressQuery });
    }

    return null;
  };
