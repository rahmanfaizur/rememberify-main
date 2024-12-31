import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import Sidebar, { SidebarItem } from "../components/ui/Sidebar";
import { useContent } from "../hooks/useContent";
import { ShareBrainBox } from "../components/ui/ShareBrianBox";
import { Navbar } from "../components/ui/Navbar";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "../icons/LogoutIcon";
// import { Home, Settings, User, Youtube, Twitter } from "lucide-react";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SpotifyIcon } from "../icons/SpotifyIcon";

export function DashBoard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // For Add Content Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // For Share Brain Modal
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Sidebar state
  const [activeType, setActiveType] = useState(""); // For filtering content by type
  const { contents, refresh } = useContent();

  const openAddContentModal = () => setIsModalOpen(true);
  const closeAddContentModal = () => setIsModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const LogoutItem = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  const fetchData = (type) => {
    setActiveType(type); // Set the active type to filter contents
  };

  useEffect(() => {
    refresh();
  }, [activeType, isModalOpen, isShareModalOpen]);

  const filteredContents = activeType
    ? contents.filter((content) => content.type === activeType)
    : contents;

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar onToggle={setSidebarExpanded}>
        <button onClick={() => fetchData("Twitter")}>
          <SidebarItem icon={<TwitterIcon size="md" />} text="Twitter" active={activeType === "Twitter"} />
        </button>
        <button onClick={() => fetchData("Youtube")}>
          <SidebarItem icon={<YoutubeIcon size="md" />} text="Youtube" active={activeType === "Youtube"} />
        </button>
        <button onClick={() => fetchData("Spotify")}>
          <SidebarItem icon={<SpotifyIcon size="md" />} text="Spotify" active={activeType === "Spotify"} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
            {filteredContents.map(({ type, link, title }) => (
              <Card
                key={link}
                link={link}
                type={type}
                title={title}
                showDelete
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}