import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-base-200 text-center px-4">
      <h1 className="text-4xl font-extrabold text-error mb-4">Access Denied</h1>
      <p className="text-base-content/70 mb-8">
        You don’t have permission to view this page.
      </p>
      <Link
        to="/"
        className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl px-6"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;
