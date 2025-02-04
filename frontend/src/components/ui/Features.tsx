import React, { useEffect, useRef, useState } from 'react';

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "📂 Organized Storage",
    description:
      "Neatly categorize your links and images for easy access and clutter-free organization.",
  },
  {
    title: "🔍 Quick Search",
    description:
      "Find links and images in seconds with our powerful, intuitive search functionality.",
  },
  {
    title: "🎵 Cross-Platform Integration",
    description:
      "Seamlessly manage content from YouTube, Twitter, Spotify, and now your favorite images!",
  },
  {
    title: "🖼️ Image Upload",
    description:
      "Easily upload and access your photos. Your memories, just a tap away!",
  },
  {
    title: "🎵 Play & View In-Site",
    description:
      "Enjoy tweets, videos, and images directly within the app for an uninterrupted experience.",
  },
  {
    title: "🤝 Share Brain",
    description:
      "Share your saved content, including images, with friends effortlessly!",
  },
];

const FeatureItem: React.FC<Feature> = ({ title, description }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        p-4 rounded-lg shadow-md border border-gray-200 bg-white
        transform transition-all duration-700
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
      `}
    >
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#39007d]">
        {title}
      </h3>
      <p className="mt-2 text-black text-sm md:text-base">
        {description}
      </p>
    </div>
  );
};

const PhoneStyleScroller: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Phone Container */}
      <div className="w-72 sm:w-80 md:w-96 lg:w-[400px] 
                      h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] 
                      bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Fake Notch / Header */}
        <div className="relative bg-my-custom-300 h-12 flex items-center justify-center">
          <div className="absolute top-2 w-16 h-1 rounded-full bg-white" />
          <span className="text-white font-bold text-sm sm:text-base md:text-lg">
            Features
          </span>
        </div>
        {/* Scrollable Content Area */}
        <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto space-y-4">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneStyleScroller;
