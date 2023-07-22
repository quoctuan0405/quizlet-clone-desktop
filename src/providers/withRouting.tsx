import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { TestPage } from "../pages/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TestPage />,
  },
]);

export const withRouter = (component: () => React.ReactNode) => () =>
  (
    <>
      <RouterProvider router={router} fallbackElement={component()} />
    </>
  );
