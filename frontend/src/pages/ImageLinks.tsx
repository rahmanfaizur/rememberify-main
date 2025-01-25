import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Define the structure of the image data
interface Image {
  link: string;
  title?: string;
}

const ImageLinks = () => {
  const [images, setImages] = useState<Image[]>([]);  // Set state to an array of Image type
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/images`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setImages(response.data.images);  // Assuming response.data.images is the array of images
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, [token]);

  const handleOpenInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-extrabold text-center text-gradient mb-8">
        Magical Image Gallery ✨
      </h1>

      {loading ? (
        <p className="text-center text-xl animate-pulse">Loading images...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:scale-105 transition-transform duration-300 ease-out"
            >
              {image.link.startsWith("http") ? (
                <img
                  src={image.link}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg group-hover:opacity-90 transition-opacity duration-300 ease-in-out"
                />
              ) : (
                <div className="bg-gray-800 w-full h-64 flex items-center justify-center rounded-lg text-white">
                  <p className="text-center text-xl font-semibold">Invalid Image Link</p>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4 opacity-75 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <h3 className="text-2xl font-bold text-white">{image.title || `Image ${index + 1}`}</h3>
              </div>

              <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <button
                  onClick={() => handleOpenInNewTab(image.link)}
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-6 py-2 rounded-full shadow-xl text-lg font-semibold transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLinks;
