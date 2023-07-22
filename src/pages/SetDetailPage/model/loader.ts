import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { getSetByIdQuery } from "../../../providers/operation/queries";
import { Params } from "../type";

export const getSetDetailPageLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { setId } = params as Params;

    const setQuery = getSetByIdQuery(setId || "");

    if (setQuery.queryKey) {
      return queryClient.fetchQuery({
        ...setQuery,
      });
    }

    return null;
  };
