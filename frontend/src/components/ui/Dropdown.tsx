import { useState, useEffect, useRef } from 'react';

const Dropdown = () => {
  // State to track the selected type (Youtube, Twitter, or Spotify)
  const [type, setType] = useState(null);

  // State to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // References to the dropdown menu and the button to detect clicks outside
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Function to handle selecting an option from the dropdown
  const handleSelect = (contentType : any) => {
    setType(contentType);  // Set the selected type
    setIsOpen(false);  // Close the dropdown once an option is selected
  };

  // Effect to handle closing the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event :any) => {
      // If the click is outside the dropdown and button, close the dropdown
      //@ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener to detect mouse clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener when the component is unmounted
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to determine the button color based on the selected type
  const getButtonColor = () => {
    switch (type) {
        //@ts-ignore
      case 'Youtube':
        return 'bg-red-500';  // Red for Youtube
        //@ts-ignore
      case 'Twitter':
        return 'bg-black';  // Black for Twitter
        //@ts-ignore
        case 'Spotify':
        return 'bg-green-500';  // Green for Spotify
      default:
        return 'bg-blue-700';  // Default color (blue)
    }
  };

  return (
    <div className="relative inline-block text-left flex justify-center pb-1 pt-1">
      {/* Button to toggle dropdown visibility */}
      <button
        ref={buttonRef}  // Attach reference to button for detecting outside clicks
        type="button"
        className={`text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${getButtonColor()}`}
        onClick={() => setIsOpen(!isOpen)}  // Toggle dropdown visibility when button is clicked
      >
        {/* Display the selected type or default message */}
        {type === 'Youtube' ? 'Youtube' : type === 'Twitter' ? 'Twitter' : type === 'Spotify' ? 'Spotify' : 'Select Type'}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu (only visible when 'isOpen' state is true) */}
      {isOpen && (
        <div
          ref={dropdownRef}  // Attach reference to dropdown menu for detecting outside clicks
          className="absolute left-1/2 transform -translate-x-1/2 z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 mt-2"
        >
          {/* Dropdown options */}
          <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            {/* Youtube Option */}
            <li>
              <button
                onClick={() => handleSelect('Youtube')}  // Set selected type to 'Youtube'
                className={`w-full text-left py-2 px-3 rounded-lg ${type === 'Youtube' ? 'bg-red-500 text-white' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Youtube
              </button>
            </li>

            {/* Twitter Option */}
            <li>
              <button
                onClick={() => handleSelect('Twitter')}  // Set selected type to 'Twitter'
                className={`w-full text-left py-2 px-3 rounded-lg ${type === 'Twitter' ? 'bg-black text-white' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Twitter
              </button>
            </li>

            {/* Spotify Option */}
            <li>
              <button
                onClick={() => handleSelect('Spotify')}  // Set selected type to 'Spotify'
                className={`w-full text-left py-2 px-3 rounded-lg ${type === 'Spotify' ? 'bg-green-500 text-white' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Spotify
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
