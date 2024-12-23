import axios from "axios";
import { BACKEND_URL } from "../../config";

export async function generateSharableLink() {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/brain/share`,
            { share: true },
            {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            }
        );

        const res = response.data.message; // Extract res
        const shareUrl = `http://localhost:5173${response.data.message}`;
        return { res, shareUrl }; // Return both res and shareUrl
    } catch (error) {
        console.error("Error generating sharable Url");
        throw error;
    }
}
