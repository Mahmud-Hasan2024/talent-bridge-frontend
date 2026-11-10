import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const ITEMS_PER_PAGE = 12;

const useFetchJobs = (
  currentPage,
  salaryRange,
  selectedCategory,
  searchQuery,
  sortOrder,
) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (salaryRange[0] > 0) params.append("salary__gte", salaryRange[0]);
      if (salaryRange[1] < 500000) params.append("salary__lte", salaryRange[1]);
      if (currentPage) params.append("page", currentPage);
      if (selectedCategory) params.append("category_id", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (sortOrder) params.append("ordering", sortOrder);

      try {
        const response = await apiClient.get(`/jobs/?${params.toString()}`);
        const data = response.data;
        const results = data.results || data || [];
        setJobs(results);
        const count = data.count ?? results.length;
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, salaryRange, selectedCategory, searchQuery, sortOrder]);

  return { jobs, loading, totalPages };
};

export default useFetchJobs;
