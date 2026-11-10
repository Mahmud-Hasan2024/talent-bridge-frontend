import { useEffect, useState } from "react";
import { Link } from "react-router";
import JobItem from "./JobItem";
import apiClient from "../../services/api-client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const FeaturedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/jobs/?featured=true")
      .then((res) => {
        const list = res.data.results || res.data || [];
        setJobs(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-base-content">
            🌟 Featured Jobs
          </h2>
          <Link
            to="/jobs"
            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-full px-6"
          >
            See All Jobs
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        )}

        {error && <p className="text-center text-error mt-6">Error: {error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-base-content/60 mt-6">
            No Featured Jobs Available
          </p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="mt-4 pb-4"
          >
            {jobs.map((job) => (
              <SwiperSlide key={job.id} className="h-auto flex">
                <JobItem job={job} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default FeaturedJob;
