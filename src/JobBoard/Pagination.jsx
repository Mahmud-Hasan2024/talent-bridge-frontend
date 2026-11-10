const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12 gap-2 flex-wrap">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          className={`btn btn-sm rounded-xl ${
            currentPage === i + 1
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-base-100 border-base-300 text-base-content hover:border-emerald-500"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
