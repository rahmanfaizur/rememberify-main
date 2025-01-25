import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import Sidebar, { SidebarItem } from "../components/ui/Sidebar";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "../icons/LogoutIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SpotifyIcon } from "../icons/SpotifyIcon";
import { ShareBrainBox } from "../components/ui/ShareBrianBox";
import { Navbar } from "../components/ui/Navbar";
import { AllIcon } from "../icons/AllIcon";
import { fetchData } from "../utils/fetchData"; // Import the fetchData function
import { toast, ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material"; // Material-UI loader
import { Camera, Facebook, Instagram } from "lucide-react";
import { PinterestIcon } from "../icons/PinterestIcon";
// import { Input } from "../components/ui/Input";
import { ImageContentModal } from "../components/ui/ImageContentModal";  // Import the modal

// Define the Content interface
interface Tag {
  _id: string;
  name: string;
}

interface Content {
  type: any;
  link: string;
  title: string;
  tags?: Tag[]; // Tags are optional, as indicated by the question mark
}

export function DashBoard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // For Add Content Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // For Share Brain Modal
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Sidebar state
  const [activeType, setActiveType] = useState("all"); // Default to 'all' to show all content initially
  const [contents, setContents] = useState<Content[]>([]); // Store fetched contents
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [searchQuery, setSearchQuery] = useState(""); //Tracks the search input!

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Debounced query state

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Debounce logic
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchQuery(searchQuery); // Update debounced value after 300ms
      }, 300);
    
      return () => clearTimeout(timer); // Clear timer on cleanup
    }, [searchQuery]);

  const openAddContentModal = () => setIsModalOpen(true);
  const closeAddContentModal = () => setIsModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const openImageContentModal = () => setIsImageModalOpen(true);
  const closeImageContentModal = () => setIsImageModalOpen(false);

  function goToLinks() {
    navigate('/images');
  }

  // const searchRef = useRef<HTMLInputElement>(null);

  // const filteredContents = contents.filter(({ title }) => {
  //   title.toLowerCase().includes(searchQuery.toLowerCase())
  // })

  const displayedContents =
  debouncedSearchQuery.trim() === ""
    ? contents
    : contents.filter(({ title }) =>
        title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      // console.log(searchQuery);
  const LogoutItem = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  const refreshCards = () => {
    setIsLoading(true); // Set loader to true
    //@ts-ignore
    fetchData(activeType, setContents, navigate).finally(() => setIsLoading(false)); // Re-fetch content
  };

  function toastShare() {
    toast("Brain Shared Successfully!");
  }

  useEffect(() => {
    //@ts-ignore
    setIsLoading(true); // Set loader to true before fetching
    fetchData(activeType, (fetchedContents) => {
      //@ts-ignore
      setContents(fetchedContents);
      setIsLoading(false); // Set loader to false after updating contents
    }, navigate);
  }, [activeType]);
  
  return (
    <div className="flex bg-black">
      {/* Sidebar Component */}
      <Sidebar onToggle={setSidebarExpanded}>
        <button onClick={() => setActiveType("all")}>
          <SidebarItem icon={<AllIcon size="md" />} text="All" active={activeType === "all"} />
        </button>
        <button onClick={() => setActiveType("twitter")}>
          <SidebarItem icon={<TwitterIcon size="md" />} text="Twitter" active={activeType === "twitter"} />
        </button>
        <button onClick={() => setActiveType("youtube")}>
          <SidebarItem icon={<YoutubeIcon size="md" />} text="Youtube" active={activeType === "youtube"} />
        </button>
        <button onClick={() => setActiveType("spotify")}>
          <SidebarItem icon={<SpotifyIcon size="md" />} text="Spotify" active={activeType === "spotify"} />
        </button>
        <button onClick={() => setActiveType("instagram")}>
          <SidebarItem icon={<Instagram></Instagram>} text="Instagram" active={activeType === "instagram"}></SidebarItem>
        </button>
        <button onClick={() => setActiveType("pinterest")}>
          <SidebarItem icon={<PinterestIcon size="md"></PinterestIcon>} text="Pinterest" active={activeType === "pinterest"}></SidebarItem>
        </button>
        <button onClick={() => setActiveType("Facebook")}>
          <SidebarItem icon={<Facebook></Facebook>} text="Facebook" active={activeType === "facebook"}></SidebarItem>
        </button>
        <button onClick={() => goToLinks()}>
          <SidebarItem icon={<Camera />} text="Image" />
        </button>

      </Sidebar>
  
      <div className={`flex-grow transition-all ${sidebarExpanded ? "ml-72" : "ml-20"}`}>
        {/* Navbar */}
        <div className="hidden md:block pl-20">
          <Navbar showLogout={true} />
        </div>
  
        <div className="p-4 min-h-screen bg-black border-y-2">
          {/* Create Content Modal */}
          <CreateContentModal open={isModalOpen} onClose={closeAddContentModal} refreshCards={refreshCards} />
  
          {/* Share Brain Modal */}
          <ShareBrainBox isModalOpen={isShareModalOpen} closeModal={closeShareModal} />
  
          <ImageContentModal
            open={isImageModalOpen} // Controls visibility
            onClose={closeImageContentModal} // Closes the modal
            refreshCards={refreshCards} // Refresh the content
          />

          {/* Search Box
          <div className="bg-white text-black p-4 rounded-md shadow-md flex items-center gap-2">
            <Input
              placeholder="Search..."
              reference={searchRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center sm:gap-4 space-y-4 sm:space-y-0">
  {/* Search Box */}
  <div className="relative w-full sm:w-auto sm:max-w-sm sm:ml-auto">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery
      className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>

  {/* Share and Add Content Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-4 sm:space-y-0 sm:ml-auto">
    <div className="flex justify-end">
    <span onClick={toastShare}>
      <Button
        padding="one"
        startIcon={<ShareIcon size="lg" />}
        variant="secondary"
        text="Share Brain"
        size="var"
        onClick={openShareModal}
      />
      <ToastContainer />
    </span>
    </div>

    <div className="flex justify-end">
    <Button
      padding="one"
      startIcon={<PlusIcon size="lg" />}
      variant="primary"
      text="Add Content"
      size="var"
      onClick={openAddContentModal}
    />
    </div>

      <div className="flex justify-end items-center">
    <Button
      padding="one"
      startIcon={<PlusIcon size="lg" />}
      variant="primary"
      text="Add Images"
      size="var"
      onClick={openImageContentModal}
    />
    <span className="ml-2 text-sm text-green-500 font-semibold bg-green-100 rounded-full px-2 py-1">
      New
    </span>
  </div>

    </div>

    {/* Logout Button (for smaller screens) */}
    <div className="flex md:hidden justify-end">
      <Button
        padding="one"
        text="Logout"
        variant="reddish"
        size="var"
        startIcon={<LogoutIcon size="lg" />}
        onClick={LogoutItem}
      />
    </div>
    </div>
  
          {/* Responsive Grid Layout for Cards */}
          {isLoading ? (
      <div className="flex justify-center items-center h-full">
        <CircularProgress /> {/* Show loader while fetching */}
      </div>
    ) : displayedContents.length > 0 ? (
      <div
        className={`grid gap-4 pt-6 ${
          sidebarExpanded
            ? "grid-cols-1 sm-custom:grid-cols-1 md-custom:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 sm-custom:grid-cols-2 md-custom:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        } justify-items-center`}
      >
        {displayedContents.map(({ type, link, title, tags }) => (
          <Card
            key={link}
            link={link}
            type={type}
            title={title}
            tags={tags} // Pass tags to the Card
            showDelete
            refreshCards={refreshCards}
          />
        ))}
      </div>
    ) : (
      <div className="text-white text-center mt-8">
        {searchQuery
          ? "No content matches your search."
          : "No content available."}
      </div>
    )}
        </div>
      </div>
    </div>
  );
}  