import { useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [fetchUrl, setFetchUrl] = useState('');
    const [imageLink, setImageLink] = useState(null);
    const [error, setError] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [tags, setTags] = useState('');
    const [title, setTitle] = useState(''); // New state for title
    const [uploadImage, setUploadImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `http://localhost:3000/api/v1/image/getLink`,
                {
                    params: { fetchUrl },
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setImageLink(response.data.url);
            setError('');
        } catch (err) {
            console.error('Error fetching image link:', err);
            //@ts-ignore
            setError(err.response?.data?.error || 'Error fetching the image link');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostLink = async (e : any) => {
        e.preventDefault();
        setIsLoading(true);

        const transformGoogleDriveLink = (url : any) => {
            const driveFileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
            const match = url.match(driveFileIdRegex);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=view&id=${match[1]}`;
            }
            return url;
        };

        const transformedUrl = transformGoogleDriveLink(inputUrl);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/image/postLink',
                {
                    inputUrl: transformedUrl,
                    tags: tags.split(',').map((tag) => tag.trim()),
                    title, // Include title
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
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
    
        if (!title || title.trim() === '') {  // Make sure title is non-empty
            setError('Please enter a valid title for the image.');
            return;
        }
    
        setIsLoading(true);
    
        const formData = new FormData();
        formData.append('image', uploadImage);
        formData.append('title', title); // Include title
        if (tags) {
            formData.append('tags', JSON.stringify(tags.split(',').map((tag) => tag.trim())));
        }
    
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/image/upload',
                formData,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
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
            {isLoading && <p>Loading...</p>}
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
            {imageLink && (
                <p>
                    Image Link:{' '}
                    <a href={imageLink} target="_blank" rel="noopener noreferrer">
                        {imageLink}
                    </a>
                </p>
            )}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
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



