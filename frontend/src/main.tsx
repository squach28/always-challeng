import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import LoginForm, { loginAction } from "./pages/auth/forms/LoginForm.tsx";
import SignupForm from "./pages/auth/forms/SignupForm.tsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
        action: loginAction,
      },
      { path: "signup", element: <SignupForm /> },
    ],
  },
  {
    index: true,
    path: "/",
    element: <App />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
