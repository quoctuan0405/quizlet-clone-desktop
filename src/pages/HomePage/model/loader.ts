import { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router-dom";
import { getSetsQuery } from "../../../providers/operation/queries";

export const getHomePageLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const setQuery = getSetsQuery();

    if (setQuery.queryKey) {
      return queryClient.fetchQuery({
        ...setQuery,
      });
    }

    return null;
  };
