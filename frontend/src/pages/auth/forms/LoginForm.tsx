import { Form, ActionFunctionArgs, Link } from "react-router";
import TextInput from "../../../components/TextInput";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  return null;
};

const LoginForm = () => {
  return (
    <>
      <Form action="/login" method="POST">
        <div className="flex flex-col gap-5 py-4">
          <h2 className="text-3xl">Log in</h2>
          <TextInput type="email" label="Email" hint="Enter your email" />
          <TextInput
            type="password"
            label="Password"
            hint="Enter your password"
          />
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
