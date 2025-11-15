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
      .then((res) => setJobs(res.data.results))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            🌟 Featured Jobs
          </h2>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2 rounded-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            See All Jobs
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 mt-6">Error: {error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No Featured Jobs Available
          </p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
            }}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="mt-4"
          >
            {jobs.map((job) => (
              <SwiperSlide key={job.id} className="flex justify-center">
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
