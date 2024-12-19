import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold">
          <Link to="/">always challeng!</Link>
        </h1>
        <Outlet />
      </section>
    </>
  );
};

export default AuthLayout;
