import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Input } from "./Input";
import Dropdown from "./Dropdown";
import { toast, ToastContainer } from "react-toastify";
import './Modal.css';

enum contentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Spotify = "spotify",
}

export function CreateContentModal({ open, onClose, refreshCards }: any) {
  const titleRef = useRef<any>();
  const linkRef = useRef<any>();
  const [type, setType] = useState<contentType>(contentType.Youtube); // Default to YouTube
  //@ts-ignore
  const [input, setInput] = useState(""); // Input state for additional features

  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('active-modal'); // Add a CSS class to disable body scrolling
    } else {
      document.body.classList.remove('active-modal'); // Remove the class when modal is closed
    }

    // Cleanup function to ensure no leftover scroll lock
    return () => {
      document.body.classList.remove('active-modal');
    };
  }, [open]);

  // Handle input changes
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true); // Set loading to true
        setTimeout(() => {
            setLoading(false); // Reset loading after 2 seconds
            // alert("Button Clicked!"); // Simulate some action
        }, 500); // Simulate a delay (e.g., API call)
    };

  // Show a success toast message
  // function toastContent() {
  //   toast.success("Content Added Successfully!");
  // }

  // Add content to the backend and refresh the UI
  async function addContent() {
    handleClick();
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    // Error handling for empty fields
    if (!title || !link) {
      toast.error("Title or Link cannot be empty!");
      return;
    } else {
      toast.success("Content Added Successfully!")
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        {
          link: link,
          title: title,
          type: type,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // toastContent(); // Show success toast
      onClose(); // Close the modal after adding content
      refreshCards(); // Trigger card refresh
    } catch (error) {
      toast.error("An error occurred while adding content. Please try again!");
    }
  }

  return (
    <div>
      {open && (
        <div className="modal">
          {/* Overlay for the modal */}
          <div className="overlay" onClick={onClose}></div>

          {/* Modal content */}
          <div className="modal-content">
            {/* Close button */}
            <div className="flex justify-end">
              <div onClick={onClose} className="cursor-pointer">
                <CrossIcon size="md" />
              </div>
            </div>
            <h1 className="flex justify-center text-white font-bold">Add Content</h1>
            {/* Input fields */}
            <div>
              <Input reference={titleRef} placeholder={"Title"} />
              <Input reference={linkRef} placeholder={"Link"} />
            </div>

            {/* Dropdown for selecting content type */}
            <h1 className="flex justify-center text-white">Type</h1>
            <Dropdown selectedType={type} setSelectedType={setType} />

            {/* Submit button */}
            <div
              className="flex justify-center pt-1"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addContent();
                }
              }}
            >
              <Button
                padding="one"
                onClick={addContent}
                variant="primary"
                text="Submit"
                size="md"
                triggerOnEnter={true}
                loading={loading}
              />
              <ToastContainer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
