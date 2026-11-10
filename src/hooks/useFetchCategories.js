import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiClient
      .get("/job-categories/")
      .then((res) => {
        setCategories(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err.message);
        setCategories([]);
      });
  }, []);

  return categories;
};

export default useFetchCategories;
