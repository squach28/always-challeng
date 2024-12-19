import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import LoginForm from "./pages/auth/forms/LoginForm.tsx";
import SignupForm from "./pages/auth/forms/SignupForm.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Route>
      <Route index element={<App />} />

      <Route path="*" />
    </Routes>
  </BrowserRouter>
);
