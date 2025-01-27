import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { useState } from "react";

export function Landing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // State to manage loading status

    // Function to handle navigation to signup page with loader
    function GoToSignup() {
        setLoading(true); // Start loader animation
        setTimeout(() => {
            navigate("/signup"); // Navigate to signup page after a short delay
        }, 1500); // Delay for the loader animation
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white flex flex-col">
            {/* Navbar */}
            <Navbar showSignin={true} showSignup={false} />

            {/* Hero Section */}
            <header className="py-20 px-8 text-center bg-gradient-to-br from-purple-800 to-blue-700 shadow-lg relative">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white animate-pulse">
                    Welcome to Rememberify
                </h1>
                <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto">
                    A smarter way to organize your life. Store links, manage images, and rediscover your favorite content—all at your fingertips.
                </p>
                <div className="mt-8">
                    <button
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105"
                        onClick={GoToSignup}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 px-8 bg-gray-800 relative">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-blue-300">
                    Why Choose Rememberify?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "📂 Organized Storage",
                            description: "Neatly categorize your links and images for easy access and clutter-free organization.",
                        },
                        {
                            title: "🔍 Quick Search",
                            description: "Find links and images in seconds with our powerful, intuitive search functionality.",
                        },
                        {
                            title: "🎵 Cross-Platform Integration",
                            description: "Seamlessly manage content from YouTube, Twitter, Spotify, and now your favorite images!",
                        },
                        {
                            title: "🖼️ Image Upload",
                            description: "Easily upload and access your photos. Your memories, just a tap away!",
                        },
                        {
                            title: "🎵 Play & View In-Site",
                            description: "Enjoy tweets, videos, and images directly within the app for an uninterrupted experience.",
                        },
                        {
                            title: "🤝 Share Brain",
                            description: "Share your saved content, including images, with friends effortlessly!",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-8 text-center bg-gradient-to-r from-blue-700 to-purple-700 text-white">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-8 animate-fade-in">
                    Upload Images and Rediscover Memories
                </h2>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                    With Rememberify, your favorite links and cherished images are always within reach. Start your journey today!
                </p>
                <div className="mt-8">
                    <button
                        className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-md hover:bg-gray-100 transition-all"
                        onClick={GoToSignup}
                    >
                        Start Uploading
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-8 text-center">
                <p className="text-gray-400 text-sm">© 2025 Faizur Rahman. All rights reserved.</p>
            </footer>

            {/* Loader Component */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                </div>
            )}
        </div>
    );
}
