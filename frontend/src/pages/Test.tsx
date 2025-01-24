import { useState, useEffect } from 'react';

const Test = () => {
    const [fetchUrl, setFetchUrl] = useState('');
    const [imageLink, setImageLink] = useState(null);
    const [error, setError] = useState('');
    const [inputUrl, setInputUrl] = useState('');
    const [tags, setTags] = useState('');
    const [uploadImage, setUploadImage] = useState(null);

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Handle GET request
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/v1/image/getLink?fetchUrl=${encodeURIComponent(fetchUrl)}`);
            const data = await response.json();
            if (response.ok) {
                console.log('Obtained Image URL:', data.url);
                setImageLink(data.url);
            } else {
                setError(data.error || 'Error fetching the image link');
            }
        } catch (err) {
            setError('Failed to fetch the image link');
            console.error(err);
        }
    };

    // Handle POST request to upload an image link
    const handlePostLink = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/v1/image/postLink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token from localStorage
                },
                body: JSON.stringify({ inputUrl, tags: tags.split(',').map(tag => tag.trim()) }) // Convert tags to array
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Uploaded Image URL:', data.image.link);
            } else {
                setError(data.error || 'Error uploading image link');
            }
        } catch (err) {
            setError('Failed to upload image link');
            console.error(err);
        }
    };

    // Handle POST request to upload an image file
    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', uploadImage);
        formData.append('tags', tags);

        try {
            const response = await fetch('http://localhost:3000/api/v1/image/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token from localStorage
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Uploaded Image URL:', data.image.link);
            } else {
                setError(data.error || 'Error uploading the image file');
            }
        } catch (err) {
            setError('Failed to upload image file');
            console.error(err);
        }
    };

    return (
        <div>
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
            {error && <p>Error: {error}</p>}

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

            <h2>Upload Image File (POST)</h2>
            <form onSubmit={handleFileUpload}>
                <input
                    type="file"
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
