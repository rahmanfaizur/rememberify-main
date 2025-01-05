import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Input } from "./Input";
import Dropdown from "./Dropdown";

enum contentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Spotify = "spotify",
}

export function CreateContentModal({ open, onClose, refreshCards }: any) {
  const titleRef = useRef<any>();
  const linkRef = useRef<any>();
  //@ts-ignore
  const [type, setType] = useState(contentType.Youtube); //default as youtube
  //@ts-ignore
  const [input, setInput] = useState("");

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;
    await axios
      .post(
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
      )
      .then(() => {
        onClose();
        refreshCards(); // Trigger card refresh after adding content
      });
  }

  return (
    <div>
      {open && (
        <div>
          <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 opacity-60 flex justify-center"></div>
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
              <span className="bg-white opacity-100 p-4 rounded">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon size="md" />
                  </div>
                </div>
                <div>
                  <Input reference={titleRef} placeholder={"title"} />
                  <Input reference={linkRef} placeholder={"link"} />
                </div>
                <h1 className="flex justify-center">Type</h1>
                <Dropdown />
                <div
                  className="flex justify-center"
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
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
