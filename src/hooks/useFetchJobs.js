import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const ITEMS_PER_PAGE = 12;

const useFetchJobs = (currentPage, salaryRange, selectedCategory, searchQuery, sortOrder) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const url = `/jobs/?salary__gt=${salaryRange[0]}&salary__lt=${salaryRange[1]}&page=${currentPage}&category_id=${selectedCategory}&search=${searchQuery}&ordering=${sortOrder}`;
      try {
        const response = await apiClient.get(url);
        const data = response.data;
        setJobs(data.results);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
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
