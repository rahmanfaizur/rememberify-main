// utils/fetchData.ts

import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

// Define the Content interface
interface Content {
  type: any;
  link: string;
  title: string;
}

export const fetchData = async (type: string, setContents: React.Dispatch<React.SetStateAction<Content[]>>, navigate: ReturnType<typeof useNavigate>) => {
  console.log(`Fetching content for type: ${type}`);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage!");
      return;
    }

    const url = type === "all" ? `${BACKEND_URL}/api/v1/content` : `${BACKEND_URL}/api/v1/refresh?type=${type}`;
    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch content. Response data:", errorData);
      throw new Error(`Failed to fetch content: ${errorData.message}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);
    setContents(data.content); // Set the fetched content
  } catch (error: any) {
    console.error("Error fetching content:", error.message);
    if (error.message.includes("invalid token")) {
      localStorage.removeItem("token");
      navigate("/signup");
    }
  }
};
