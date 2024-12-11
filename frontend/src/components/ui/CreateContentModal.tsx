import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { Input } from "./Input";

enum contentType {
    Youtube = "youtube",
    Twitter = "twitter",
    Spotify = "spotify"
}

export function CreateContentModal({ open, onClose}) { //controlled component!
    // const [modalOpen, setModalOpen] = useState(false);

    const titleRef = useRef<any>();
    const linkRef = useRef<any>();
    const [type, setType] = useState(contentType.Youtube) //default as youtube

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            link: link,
            title: title,
            type: type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
        onClose();
    }

    return (
        <div>
            {/* <CrossIcon onClick={() => {
                //since its defined outside￼
￼
 we send a signal to the parent component!
                // we need a popup ui above!

            }}/> */}
            {open && 
            <div>
                <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 opacity-60 flex justify-center">
                    
                </div>
                <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                    <div className="flex flex-col justify-center">
                        <span className="bg-white opacity-100 p-4 rounded">
                            <div className="flex justify-end">
                                <div onClick={onClose} className="cursor-pointer">
                                    <CrossIcon size="md"/>   
                                </div>
                            </div>
                            <div>
                             <Input reference={titleRef} placeholder={"title"}/>
                             <Input reference={linkRef} placeholder={"link"}/>
                            </div>
                            <h1 className="flex justify-center">Type</h1>
                                <div className="flex gap-1 p-4 justify-center">
                                    <Button text="Youtube" variant={type === contentType.Youtube ? "reddish" : "secondary"} size="md" onClick={
                                        () => {
                                            setType(contentType.Youtube)
                                        }
                                    }></Button>
                                    <Button text="Twitter" variant={type === contentType.Twitter ? "blacky" : "secondary"} size="md" onClick={
                                        () => {
                                            setType(contentType.Twitter)
                                        }
                                    }></Button>
                                    <Button text="Spotify" variant={type === contentType.Spotify ? "greeny" : "secondary"} size="md" onClick={
                                        () => {
                                            setType(contentType.Spotify)
                                        }
                                    }></Button>
                                </div>
                            <div className="flex justify-center"><Button onClick={addContent} variant="primary" text="Submit" size="md"/></div>
                        </span>
                    </div>
                </div>
            </div>}
        </div>
    )
}