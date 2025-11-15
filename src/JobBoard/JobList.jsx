import JobItem from "../components/Jobs/JobItem";

const JobList = ({ jobs, loading }) => {
  if (loading)
    return (
      <div className="flex justify-center items-center py-10 min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );

  if (jobs.length === 0)
    return (
      <div className="text-center py-10 text-gray-600 font-semibold">
        No jobs found. Try adjusting your filters.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
