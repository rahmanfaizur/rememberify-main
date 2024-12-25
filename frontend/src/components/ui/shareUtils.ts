import axios from "axios";

export async function generateSharableLink() {
    try {
        // Dynamically determine the frontend URL
        const FRONTEND_URL = window.location.origin;

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/brain/share`, // Use VITE_BACKEND_URL from env
            { share: true },
            {
                headers: {
                    Authorization: localStorage.getItem("token"), // Include token in headers
                },
            }
        );

        const res = response.data.message; // Extract the response message
        const shareUrl = `${FRONTEND_URL}${res}`; // Use the dynamic frontend URL
        return { res, shareUrl }; // Return both the response and share URL
    } catch (error) {
        console.error("Error generating sharable URL:", error);
        throw error;
    }
}
