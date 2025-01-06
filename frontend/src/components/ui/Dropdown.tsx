import { useState, useEffect, useRef } from 'react';

const Dropdown = ({ selectedType, setSelectedType }: any) => {
  // State to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // References to the dropdown menu and the button to detect clicks outside
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Function to handle selecting an option from the dropdown
  const handleSelect = (contentType: string) => {
    setSelectedType(contentType);  // Pass the selected type back to the parent
    setIsOpen(false);  // Close the dropdown once an option is selected
  };

  // Effect to handle closing the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        //@ts-ignore
        !dropdownRef.current.contains(event.target) &&
        //@ts-ignore
        !buttonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonColor = () => {
    switch (selectedType) {
      case 'youtube':
        return 'bg-red-500';
      case 'twitter':
        return 'bg-black';
      case 'spotify':
        return 'bg-green-500';
      default:
        return 'bg-blue-700';
    }
  };

  return (
    <div className="relative inline-block text-left flex justify-center pb-1 pt-1">
      <button
        ref={buttonRef}
        type="button"
        className={`text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ${getButtonColor()}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedType === 'youtube' ? 'Youtube' : selectedType === 'twitter' ? 'Twitter' : selectedType === 'spotify' ? 'Spotify' : 'Select Type'}
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

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-1/2 transform -translate-x-1/2 z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 mt-2"
        >
          <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button
                onClick={() => handleSelect('youtube')}
                className={`w-full text-left py-2 px-3 rounded-lg ${selectedType === 'youtube' ? 'bg-red-500 text-white' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Youtube
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSelect('twitter')}
                className={`w-full text-left py-2 px-3 rounded-lg ${selectedType === 'twitter' ? 'bg-black text-white' : 'text-gray-700 dark:text-gray-200'}`}
              >
                Twitter
              </button>
            </li>

            <li>
              <button
                onClick={() => handleSelect('spotify')}
                className={`w-full text-left py-2 px-3 rounded-lg ${selectedType === 'spotify' ? 'bg-green-500 text-white' : 'text-gray-700 dark:text-gray-200'}`}
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
