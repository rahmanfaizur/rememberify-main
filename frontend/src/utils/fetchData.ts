// utils/fetchData.ts

import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

// Define the Content interface
interface Content {
  type: any;
  link: string;
  title: string;
  tags: []; // Updated to accommodate tags
}

export const fetchData = async (
  type: string,
  setContents: React.Dispatch<React.SetStateAction<Content[]>>,
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage!");
      return;
    }

    const url =
      type === "all"
        ? `${BACKEND_URL}/api/v1/content`
        : `${BACKEND_URL}/api/v1/refresh?type=${type}`;

    // Replacing fetch with axios for API request
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      console.error("Failed to fetch content. Response data:", response.data);
      throw new Error(`Failed to fetch content: ${response.data.message}`);
    }

    const data = response.data;
    setContents(data.content); // Set the fetched content
    // console.log(data.content);
  } catch (error: any) {
    console.error("Error fetching content:", error.message);
    if (error.response?.data?.message?.includes("invalid token")) {
      localStorage.removeItem("token");
      navigate("/signup");
    }
  }
};
