import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { getSetByIdQuery } from "../../../providers/operation/queries";
import { Param } from "../type";

export const getSetEditPageLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { setId } = params as Param;

    const setQuery = getSetByIdQuery(setId || "");

    if (setQuery.queryKey) {
      return queryClient.fetchQuery({
        ...setQuery,
      });
    }

    return null;
  };
