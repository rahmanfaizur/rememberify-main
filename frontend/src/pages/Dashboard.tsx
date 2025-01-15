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

  const openAddContentModal = () => setIsModalOpen(true);
  const closeAddContentModal = () => setIsModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

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
  
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <span onClick={toastShare}>
              <Button
                padding="one"
                startIcon={<ShareIcon size="lg" />}
                variant="secondary"
                text="Share Brain"
                size="var"
                onClick={openShareModal}
              />
              <ToastContainer></ToastContainer>
            </span>
            <Button
              padding="one"
              startIcon={<PlusIcon size="lg" />}
              variant="primary"
              text="Add Content"
              size="var"
              onClick={openAddContentModal}
            />
            <div className="md:hidden flex flex-col justify-center">
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
          ) : contents.length > 0 ? (
            <div
              className={`grid gap-4 pt-6 ${
                sidebarExpanded
                  ? "grid-cols-1 sm-custom:grid-cols-1 md-custom:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm-custom:grid-cols-2 md-custom:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } justify-items-center`}
            >
              {contents.map(({ type, link, title, tags }) => (
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
            <div className="text-white text-center mt-8">No content available.</div>
          )}
        </div>
      </div>
    </div>
  );
}  