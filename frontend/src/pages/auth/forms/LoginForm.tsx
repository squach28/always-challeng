import { Form } from "react-router";

export const loginAction = async ({ request }) => {};

const LoginForm = () => {
  return (
    <>
      <h2 className="text-2xl">Log in</h2>
      <Form action="/login" method="POST">
        <input type="email" />
        <input type="password" />
      </Form>
    </>
  );
};

export default LoginForm;
