import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export async function urlHandler(fetchUrl: any) {
    const url = cloudinary.url(fetchUrl, {
        transformation: [
            {
                fetch_format: 'auto', // Most efficient format for that device maybe webp and also it decreases the size of the image/gif!
            },
            {
                quality: 'auto' // This decreases quality while not compromising the image quality!
            },
            {
                width: 1200
            }
        ]
    });
    return { url }; // Return the URL as a JSON object
}

export async function imageUploader(inputUrl: any) {
    const results = await cloudinary.uploader.upload(inputUrl);
    const url = cloudinary.url(results.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto"
            },
            {
                width: 1200,
                height: 1200,
                crop: "fill",
                gravity: "auto"
            }
        ]
    })
    return { url }; // Return the URL as a JSON object
}
