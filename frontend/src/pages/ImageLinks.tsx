import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface Image {
  link: string;
  title?: string;
}

const ImageLinks = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/images`, {
          headers: { Authorization: `${token}` },
        });
        setImages(response.data.images);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-radial-gradient from-purple-500/30 to-transparent blur-3xl animate-float"></div>
        <div className="absolute w-96 h-96 bg-radial-gradient from-blue-500/30 to-transparent blur-3xl right-0 bottom-0 animate-float-delayed"></div>
      </div>

      {/* Dashboard button */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        ← Back to Dashboard
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">🚀</span>
      </button>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-text-shine">
          Your Image Library
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-800/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group perspective-1000 hover:perspective-1000 transition-all duration-500"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden transform transition-all duration-500 group-hover:rotate-x-12 group-hover:scale-105 shadow-2xl">
                  {image.link.startsWith("http") ? (
                    <img
                      src={image.link}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800/50 flex items-center justify-center">
                      <p className="text-slate-400 text-lg">🔗 Broken Link</p>
                    </div>
                  )}

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {image.title || `Moment #${index + 1}`}
                    </h3>
                    
                    <button
                      onClick={() => handleOpenInNewTab(image.link)}
                      className="w-full bg-white/10 backdrop-blur-lg py-3 rounded-lg text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Explore</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 2.739 1.38a1 1 0 001.548-1.067l-1.38-2.738 2.76-1.379a1 1 0 00-.075-1.822l-10-4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLinks;