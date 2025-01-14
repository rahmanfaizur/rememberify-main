import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SpotifyIcon } from "../../icons/SpotifyIcon";
import { toast, ToastContainer } from "react-toastify";
import { LinkIcon } from "../../icons/LinkIcon";

// Define the CardProps interface
interface CardProps {
  title: string;
  tags?: any;
  link: string;
  type: "twitter" | "youtube" | "spotify" | "anyLink";
  showDelete: boolean;
  refreshCards?: () => void; // Function to trigger card refresh
}

export function Card({ title, link, type, tags, showDelete, refreshCards }: CardProps) {
  const handleDelete = () => {
    axios
      .delete(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: {
          title,
          link,
          type,
          tags
        },
      })
      .then((response) => {
        console.log(response.data.message); // Optional: handle success
        refreshCards?.(); // Trigger card refresh after deletion
      })
      .catch((error) => {
        console.error("Error deleting content:", error); // Optional: handle error
      });
  };

  function convertToEmbedLink(link: string) {
    const parts = link.split("open.spotify.com/");
    if (parts.length > 1) {
      return `${parts[0]}open.spotify.com/embed/${parts[1]}`;
    }
    return link; // Return the original link if it doesn't match the expected format
  }

  function toastDelete() {
    toast("Content Deleted Successfully!")
  }


  return (
    <div className="p-8 bg-gray-800 text-white rounded-md border-white border max-w-72 min-48 min-w-72 gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center font-semibold">
          <div className="text-gray-500 pr-2">
            {type === "twitter" && <TwitterIcon size="md" />}
            {type === "youtube" && <YoutubeIcon size="md" />}
            {type === "spotify" && <SpotifyIcon size="lg" />}
            {type === "anyLink" && <LinkIcon size="md" />}
          </div>
          {title}
        </div>
        <div className="flex items-center">
          <div className="pr-2 text-white">
            <a href={link} target="_blank">
              <ShareIcon size="md" />
            </a>
          </div>
          {showDelete && (
            <div className="text-white" onClick={toastDelete}>
              <button onClick={handleDelete}>
                <DeleteIcon size="md" />
              </button>
              <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              // transition={Bounce}
              />
            </div>
          )}
        </div>
      </div>
      <div className="pt-4">
        {type === "youtube" && (
          <iframe
            className="w-full"
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        {type === "spotify" && (
          <iframe
            className="border-radius:12px"
            src={convertToEmbedLink(link)}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        )}
        {type === "twitter" && (
          <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
        {type === "anyLink" && (
            <div className="flex justify-center items-center flex-col pt-10 font-extrabold">
              Other Links!
            </div>
          )}
      </div>
          {/* Tags section */}
          {tags && tags.length > 0 && (
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag: { _id: string; name: string }) => (
            <span
              key={tag._id}
              className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}          
    </div>
  );
}
