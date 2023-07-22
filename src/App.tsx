import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { TestPage } from "./pages/TestPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAltMainLoader, getRootLoader } from "./pages/model/loader";
import { RootLayout } from "./pages/RootLayout";
import { HomePage } from "./pages/HomePage";
import { getHomePageLoader } from "./pages/HomePage/model/loader";
import { getSetDetailPageLoader } from "./pages/SetDetailPage/model/loader";
import { SetDetailPage } from "./pages/SetDetailPage";
import { LearningPage } from "./pages/LearningPage";
import { getLearningPageLoader } from "./pages/LearningPage/model/loader";
import { getSetEditPageLoader } from "./pages/SetEditPage/model/loader";
import { SetEditPage } from "./pages/SetEditPage";
import { SetCreatePage } from "./pages/SetCreatePage";
import { SetImportPage } from "./pages/SetImportPage";

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: getRootLoader(queryClient),
    children: [
      {
        path: "",
        loader: getHomePageLoader(queryClient),
        element: <HomePage />,
      },
      {
        path: "set/:setId",
        loader: getSetDetailPageLoader(queryClient),
        element: <SetDetailPage />,
      },
      {
        path: "set/learning/:setId",
        loader: getLearningPageLoader(queryClient),
        element: <LearningPage />,
      },
      {
        path: "set/edit/:setId",
        loader: getSetEditPageLoader(queryClient),
        element: <SetEditPage />,
      },
      {
        path: "set/import",
        element: <SetImportPage />,
      },
      {
        path: "set/create",
        element: <SetCreatePage />,
      },
    ],
  },
]);

export default () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
};
