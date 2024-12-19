import { Form, ActionFunctionArgs, Link } from "react-router";
import { useState } from "react";
import { LoginDetails } from "../../../types/LoginDetails";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  return null;
};

const LoginForm = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name;
    const value = e.target.value;
    setLoginDetails({
      ...loginDetails,
      [field]: value,
    });
  };
  return (
    <>
      <Form action="/login" method="POST">
        <div className="flex flex-col gap-5 py-4">
          <h2 className="text-3xl">Log in</h2>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="w-full rounded-md border border-gray-200 p-2 focus:bg-gray-100 focus:outline-gray-500"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="w-full rounded-md border border-gray-200 p-2 focus:bg-gray-100 focus:outline-gray-500"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <button
            className="w-full rounded-md bg-black p-2 font-bold text-white"
            type="submit"
          >
            Log in
          </button>

          <p className="mt-2 text-center">
            Don't have an account?{" "}
            <Link className="font-bold underline" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
