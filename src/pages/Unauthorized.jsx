import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-8">
        You don’t have permission to view this page.
      </p>
      <Link
        to="/"
        className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;
