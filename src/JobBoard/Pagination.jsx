const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <div className="flex justify-center mt-12">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          className={`btn btn-sm mx-1 rounded-full ${
            currentPage === i + 1
              ? "bg-emerald-600 text-white"
              : "bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
