import { useState, useEffect } from "react";
import { generateSharableLink } from "./shareUtils";

export const AlertBox = () => {
    const [shareUrl, setShareUrl] = useState<string>("");

    useEffect(() => {
        const fetchShareUrl = async () => {
            const { shareUrl } = await generateSharableLink();
            setShareUrl(shareUrl);
        };

        fetchShareUrl();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div>
            <p>Sharable Link: {shareUrl}</p>
        </div>
    );
};
