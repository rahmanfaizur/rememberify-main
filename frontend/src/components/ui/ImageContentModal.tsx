import { useState, useEffect } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import './Modal.css';

export function ImageContentModal({ open, onClose, refreshCards }: any) {
  const [uploadImage, setUploadImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState('');
  const [title, setTitle] = useState('');
  const [fetchUrl, setFetchUrl] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  const transformGoogleDriveLink = (url: string) => {
    const driveFileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(driveFileIdRegex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }

    return () => {
      document.body.classList.remove('active-modal');
    };
  }, [open]);

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Please enter a valid title for the image.');
      return;
    }
    if (!fetchUrl && !uploadImage) {
      setError('Please select an image to upload or provide an image URL.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (uploadImage) {
      formData.append('image', uploadImage);
    } else {
      const transformedUrl = transformGoogleDriveLink(fetchUrl);
      formData.append('inputUrl', transformedUrl);
    }

    formData.append('title', title);
    if (tags.trim() && !uploadImage) {
      formData.append('tags', JSON.stringify(tags.split(',').map((tag) => tag.trim())));
    }

    try {
      const endpoint = uploadImage
        ? `${BACKEND_URL}/api/v1/image/upload`
        : `${BACKEND_URL}/api/v1/image/postLink`;

      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": uploadImage ? "multipart/form-data" : "application/json",
        },
      });

      toast.success("Image uploaded successfully!");
      onClose();
      refreshCards();
    } catch (err) {
      console.error("Error occurred during upload:", err);
      setError('Error uploading the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadImage(null);
    setFetchUrl('');
  };

  return (
    <div>
      {open && (
        <div className="modal">
          <div className="overlay" onClick={onClose}></div>
          <div className="modal-content">
            <div className="flex justify-end">
              <div onClick={onClose} className="cursor-pointer">
                <CrossIcon size="md" />
              </div>
            </div>
            <h1 className="flex justify-center text-white font-bold">Add Image Content</h1>
            <div className="text-black">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-black"
              />
              {!uploadImage && (
                <input
                  type="text"
                  placeholder="Enter tags separated by commas (optional)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input-field text-black"
                />
              )}
            </div>
            <div className="text-black">
              <h2 className="flex justify-center text-white">Enter Image URL</h2>
              <input
                type="text"
                placeholder="Image URL"
                value={fetchUrl}
                onChange={(e) => setFetchUrl(e.target.value)}
                disabled={!!uploadImage}
                className="input-field text-black"
              />
            </div>
            <div className="text-black">
              <h2 className="flex justify-center text-white">Or Upload Image File</h2>
              <div className="flex items-center">
                <input
                  type="file"
                  //@ts-ignore
                  onChange={(e) => setUploadImage(e.target.files?.[0] || null)}
                  disabled={!!fetchUrl}
                  className="input-field text-black"
                />
                {uploadImage && (
                  <div
                    onClick={clearUploadedFile}
                    className="cursor-pointer ml-2 text-red-500"
                  >
                    <CrossIcon size="sm" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center pt-1">
              <Button
                padding="one"
                onClick={handleSubmit}
                variant="primary"
                text="Submit"
                size="md"
                loading={isLoading}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ToastContainer />
          </div>
        </div>
      )}
    </div>
  );
}
