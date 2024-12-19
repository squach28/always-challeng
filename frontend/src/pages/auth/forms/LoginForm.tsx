import { Form, ActionFunctionArgs } from "react-router";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  return null;
};

const LoginForm = () => {
  return (
    <>
      <Form action="/login" method="POST">
        <div className="flex flex-col items-center justify-center gap-2 bg-sky-700 py-4">
          <h2 className="text-3xl">Log in</h2>
          <input className="w-full border border-black" type="email" />
          <input className="w-full border border-black" type="password" />
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
