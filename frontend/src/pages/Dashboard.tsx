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
import { BACKEND_URL } from "../config";

// Define the Content interface
interface Content {
  type: any;
  link: string;
  title: string;
}

export function DashBoard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // For Add Content Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // For Share Brain Modal
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Sidebar state
  const [activeType, setActiveType] = useState("all"); // Default to 'all' to show all content initially
  const [contents, setContents] = useState<Content[]>([]); // Store fetched contents

  const openAddContentModal = () => setIsModalOpen(true);
  const closeAddContentModal = () => setIsModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const LogoutItem = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  const fetchData = async (type: string) => {
    console.log(`Fetching content for type: ${type}`);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage!");
        return;
      }

      const url = type === "all" ? `${BACKEND_URL}/api/v1/content` : `${BACKEND_URL}/api/v1/refresh?type=${type}`;
      const response = await fetch(url, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch content. Response data:", errorData);
        throw new Error(`Failed to fetch content: ${errorData.message}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setContents(data.content); // Set the fetched content
    } catch (error: any) {
      console.error("Error fetching content:", error.message);
      if (error.message.includes("invalid token")) {
        localStorage.removeItem("token");
        navigate("/signup");
      }
    }
  };

  useEffect(() => {
    fetchData(activeType); // Fetch content based on active type
  }, [activeType]);

  return (
    <div className="flex">
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

      <div
        className={`flex-grow transition-all ${
          sidebarExpanded ? "ml-72" : "ml-20"
        }`}
      >
        {/* Navbar */}
        <div className="hidden md:block pl-20">
          <Navbar />
        </div>

        <div className="p-4 min-h-screen bg-slate-200 border-2">
          {/* Create Content Modal */}
          <CreateContentModal open={isModalOpen} onClose={closeAddContentModal} />

          {/* Share Brain Modal */}
          <ShareBrainBox isModalOpen={isShareModalOpen} closeModal={closeShareModal} />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              padding="one"
              startIcon={<ShareIcon size="lg" />}
              variant="secondary"
              text="Share Brain"
              size="md"
              onClick={openShareModal}
            />
            <Button
              padding="one"
              startIcon={<PlusIcon size="lg" />}
              variant="primary"
              text="Add Content"
              size="sm"
              onClick={openAddContentModal}
            />
            <div className="block md:hidden">
              <Button
                padding="one"
                text="Logout"
                variant="reddish"
                size="md"
                startIcon={<LogoutIcon size="lg" />}
                onClick={LogoutItem}
              />
            </div>
          </div>

          {/* Responsive Grid Layout for Cards */}
                    {/* Responsive Grid Layout for Cards */}
                    <div
            className={`grid gap-4 pt-6 ${
              sidebarExpanded
                ? "grid-cols-1 sm-custom:grid-cols-1 md-custom:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 sm-custom:grid-cols-2 md-custom:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            } justify-items-center`}
          >
            {contents.map(({ type, link, title }) => (
              <Card key={link} link={link} type={type} title={title} showDelete />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
