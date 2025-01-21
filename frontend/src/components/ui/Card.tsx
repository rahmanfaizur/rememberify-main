import { useState } from "react"; // Import useState
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SpotifyIcon } from "../../icons/SpotifyIcon";
import { toast, ToastContainer } from "react-toastify";
import { LinkIcon } from "../../icons/LinkIcon";
import './Modal.css';
import { CrossIcon } from "../../icons/CrossIcon";
import { TwitterTweetEmbed} from 'react-twitter-embed';
import { FacebookEmbed, InstagramEmbed, PinterestEmbed } from 'react-social-media-embed';

interface CardProps {
  title: string;
  tags?: any;
  link: string;
  type: "twitter" | "youtube" | "spotify" | "anyLink" | "facebook" | "instagram" | "pinterest";
  showDelete: boolean;
  refreshCards?: () => void;
}

export function Card({ title, link, type, tags, showDelete, refreshCards }: CardProps) {
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

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
          tags,
        },
      })
      .then((response) => {
        console.log(response.data.message); // Optional: handle success
        toast("Content Deleted Successfully!");
        refreshCards?.(); // Trigger card refresh after deletion
      })
      .catch((error) => {
        console.error("Error deleting content:", error); // Optional: handle error
      });
    setShowPopup(false); // Close the popup
  };

  function convertToEmbedLink(link: string) {
    const parts = link.split("open.spotify.com/");
    if (parts.length > 1) {
      return `${parts[0]}open.spotify.com/embed/${parts[1]}`;
    }
    return link;
  }
  // Define a function to extract the number after "status"
function extractStatusNumber(url: string): string {
  const match = url.match(/\/status\/(\d+)/);
  //@ts-ignore
  return match ? match[1] : null; // Return the captured group if there's a match
}
const embedNo = extractStatusNumber(link);
  // console.log(link);

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
            <div className="text-white">
              <button onClick={() => setShowPopup(true)}>
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
          
          // <blockquote className="twitter-tweet">
          //   <a href={link.replace("x.com", "twitter.com")}></a>
          // </blockquote>
          <TwitterTweetEmbed
          tweetId={embedNo}
          />
          // <div style={{ display: 'flex', justifyContent: 'center' }}>
          //   <XEmbed url={link} width={325} />
          // </div>
        )}
        {type === "facebook" && (
          <FacebookEmbed url={link} ></FacebookEmbed>
        )}
        {type === "pinterest" && (
          <PinterestEmbed url={link}></PinterestEmbed>
        )}
        {type === "instagram" && (
          <InstagramEmbed url={link}></InstagramEmbed>
        )}
        {type === "anyLink" && (
          <div className="flex justify-center items-center flex-col pt-10 font-extrabold">
            Other Links!
          </div>
        )}
      </div>
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
      {/* Delete confirmation popup */}
      {showPopup && (
  <div
    className="modal overlay"
    onClick={() => setShowPopup(false)} // Close modal on overlay click
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      <button
        className="close-modal"
        onClick={() => setShowPopup(false)} // Close modal on close button click
      >
        <CrossIcon size="md" />
      </button>
      <p className="mb-6 pt-2">Are you sure you want to delete this content?</p>
      <div className="flex justify-end gap-2">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
