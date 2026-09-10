import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const getImageUrl = (image) => {
  if (!image) return "";

  // Convert old localhost URLs to the deployed backend URL
  if (image.includes("localhost:5000")) {
    return image.replace("http://localhost:5000", BACKEND_URL);
  }

  // If image is already a complete URL
  if (image.startsWith("http")) {
    return image;
  }

  // If image is only a filename or relative path
  const cleanImage = image.replace(/^\/?uploads\//, "");

  return `${BACKEND_URL}/uploads/${cleanImage}`;
};

export default API;
