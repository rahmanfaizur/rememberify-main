import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export function Landing() {
    const navigate = useNavigate();
    function GoToSignup() {
        navigate("/signup")
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Navbar */}
            <Navbar showSignin={true} showSignup={false} />

            {/* Hero Section */}
            <header className="bg-gray-800 py-16 px-8 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-400">
                    Welcome to Rememberify
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    A smart tool to organize your life. Store, manage, and rediscover your favorite YouTube, Twitter, Spotify and other important links in one place.
                </p>
                <div className="mt-6">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all" onClick={GoToSignup}>
                        Get Started
                    </button>
                </div>
            </header>

{/* Features Section */}
<section className="py-16 px-8 bg-gray-700">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-300">
        Why Choose Rememberify?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                📂 Organized Storage
            </h3>
            <p className="text-gray-300">
                Keep all your favorite links neatly stored and categorized by platform for easy access.
            </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                🔍 Quick Search (coming soon)
            </h3>
            <p className="text-gray-300">
                Find what you need in seconds with our powerful search functionality.
            </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                🎵 Cross-Platform Integration
            </h3>
            <p className="text-gray-300">
                Seamlessly manage content from YouTube, Twitter, and Spotify—all in one app.
            </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
                🎵 Play & View In-Site
            </h3>
            <p className="text-gray-300">
                View concise tweets and play videos directly within the app for an uninterrupted experience.
            </p>
        </div>
    </div>
</section>

            <footer className="bg-gray-800 py-6 text-center">
                <p className="text-gray-400 text-sm">
                © 2024 Faizur Rahman. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
