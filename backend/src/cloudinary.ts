import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs/promises"
import dotenv from 'dotenv';

dotenv.config();


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
            // {
            //     width: 1200
            // }
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
            // {
            //     width: 1200,
            //     height: 1200,
            //     crop: "fill",
            //     gravity: "auto"
            // }
        ]
    })
    return { url }; // Return the URL as a JSON object
}

// New function to handle file uploads
export async function fileUploader(fileBuffer: Buffer, fileName: string) {
    try {
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        // {
                        //     width: 1200,
                        //     height: 1200,
                        //     crop: "fill",
                        //     gravity: "auto",
                        // },
                    ],
                    public_id: fileName.split('.')[0], // Use the file name (without extension) for the public ID
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(fileBuffer); // Pass the file buffer to the stream
        });

        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
}