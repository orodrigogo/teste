import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./app/layout";
import { Error } from "./error";
import { Dashboard } from "./app/dashboard";
import { Products } from "./app/products";
import { AuthLayout } from "./auth/layout";
import { SignIn } from "./auth/sign-in";
import { SignUp } from "./auth/sign-up";
import { NotFound } from "./404";
import { NewProduct } from "./app/products/new-product";
import { EditProduct } from "./app/products/edit-product";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/new",
        element: <NewProduct />,
      },
      {
        path: "/products/edit/:id",
        element: <EditProduct />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
