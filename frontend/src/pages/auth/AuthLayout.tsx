import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center py-10">
        <h1 className="text-3xl font-bold">always challeng!</h1>
        <Outlet />
      </section>
    </>
  );
};

export default AuthLayout;
