import { useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [fetchUrl, setFetchUrl] = useState('');
    const [imageLink, setImageLink] = useState(null);
    const [error, setError] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [tags, setTags] = useState('');
    const [uploadImage, setUploadImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loader state

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Handle GET request
    const handleSubmit = async (e : any) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
    
            const response = await axios.get(
                `http://localhost:3000/api/v1/image/getLink`,
                {
                    params: { fetchUrl }, // Send fetchUrl as query parameter
                    headers: {
                        Authorization: `${token}`, // Add Bearer token in the Authorization header
                        'Content-Type': 'application/json', // Optional, but ensures proper formatting
                    },
                }
            );
    
            setImageLink(response.data.url); // Set the retrieved image link
            setError('');
        } catch (err) {
            console.error('Error fetching image link:', err);
            //@ts-ignore
            setError(err.response?.data?.error || 'Error fetching the image link');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle POST request to upload an image link
    const handlePostLink = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        // Helper function to transform Google Drive links
        const transformGoogleDriveLink = (url : any) => {
            const driveFileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
            const match = url.match(driveFileIdRegex);
            if (match && match[1]) {
                // Convert to direct download link
                return `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
            return url; // Return the original URL if it's not a Google Drive link
        };
    
        // Transform the input URL if needed
        const transformedUrl = transformGoogleDriveLink(inputUrl);
    
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/image/postLink',
                {
                    inputUrl: transformedUrl,
                    tags: tags.split(',').map(tag => tag.trim()),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`, // Include the token from localStorage
                    },
                }
            );
            console.log('Uploaded Image URL:', response.data.image.link);
            setError('');
        } catch (err) {
            //@ts-ignore
            setError(err.response?.data?.error || 'Error uploading image link');
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleFileUpload = async (e : any) => {
        e.preventDefault();
    
        if (!uploadImage) {
            setError('Please select an image to upload.');
            return;
        }
    
        setIsLoading(true);
    
        // Create FormData object
        const formData = new FormData();
        formData.append('image', uploadImage); // Attach image file
        if (tags) {
            // Convert tags to a JSON string and append it
            formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
        }
    
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/image/upload',
                formData,
                {
                    headers: {
                        Authorization: `${token}`, // Use Bearer token for authorization
                        'Content-Type': 'multipart/form-data', // Required for file uploads
                    },
                }
            );
    
            // Handle successful response
            console.log('Uploaded Image URL:', response.data.image.link);
            setError('');
        } catch (error) {
            console.error('Error uploading the image file:', error);
            setError(
                //@ts-ignore
                error.response?.data?.error || 'Error uploading the image file'
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    
    

    return (
        <div>
            {isLoading && <p>Loading...</p>} {/* Loader */}
            
            <h2>Fetch Image Link (GET)</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={fetchUrl}
                    onChange={(e) => setFetchUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button type="submit">Fetch Image Link</button>
            </form>
            {imageLink && <p>Image Link: <a href={imageLink} target="_blank" rel="noopener noreferrer">{imageLink}</a></p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <hr />

            <h2>Upload Image Link (POST)</h2>
            <form onSubmit={handlePostLink}>
                <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter image URL"
                />
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags (comma-separated)"
                />
                <button type="submit">Upload Image Link</button>
            </form>

            <hr />

            <h2>Upload Image File (POST)</h2>
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
                    //@ts-ignore
                    onChange={(e) => setUploadImage(e.target.files[0])}
                    required
                />
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags (comma-separated)"
                />
                <button type="submit">Upload Image File</button>
            </form>
        </div>
    );
};

export default Test;
