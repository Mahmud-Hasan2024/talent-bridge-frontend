import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiClient.get("/job-categories/").then((res) => setCategories(res.data));
  }, []);

  return categories;
};

export default useFetchCategories;
