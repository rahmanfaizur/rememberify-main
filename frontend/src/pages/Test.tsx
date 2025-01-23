// import React, { useState } from "react";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";

// const Test: React.FC = () => {
//   const [fetchUrl, setFetchUrl] = useState("");
//   const [inputUrl, setInputUrl] = useState("");
//   const [tags, setTags] = useState<string>("");
//   const [getLinkResult, setGetLinkResult] = useState("");
//   const [postLinkResult, setPostLinkResult] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");
//   console.log("Fetched token from localStorage:", token);

//   // Handle image drop using react-dropzone
//   const onDrop = (acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       console.log("File dropped:", acceptedFiles[0]);
//       setFile(acceptedFiles[0]);
//     } else {
//       console.error("No file was dropped.");
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: "image/*",
//     multiple: false,
//   });

//   const handleGetLink = async () => {
//     console.log("Attempting to fetch link with URL:", fetchUrl);
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/v1/image/getLink",
//         {
//           params: { fetchUrl },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Response received for Get Link:", response.data);
//       setGetLinkResult(response.data.url);
//     } catch (error) {
//       console.error("Error occurred while fetching link:", error);
//       setGetLinkResult("Failed to fetch link");
//     } finally {
//       setLoading(false);
//       console.log("Get Link request completed.");
//     }
//   };

//   const handlePostLink = async () => {
//     console.log("Attempting to upload image using URL:", inputUrl);
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/image/postLink",
//         { inputUrl, tags: tags.split(",").map((tag) => tag.trim()) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("Response received for Post Link:", response.data);
//       setPostLinkResult(response.data.image.link);
//     } catch (error) {
//       console.error("Error occurred while posting link:", error);
//       setPostLinkResult("Failed to upload image");
//     } finally {
//       setLoading(false);
//       console.log("Post Link request completed.");
//     }
//   };

//   const handleUploadFile = async () => {
//     if (!file) {
//       console.error("No file selected for upload.");
//       return;
//     }
//     console.log("Uploading file:", file.name);

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("tags", JSON.stringify(tags.split(",").map((tag) => tag.trim())));

//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/image/upload",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("Response received for File Upload:", response.data);
//       setPostLinkResult(response.data.image.link);
//     } catch (error) {
//       console.log("Error occurred while uploading file:", error);
//       setPostLinkResult("Failed to upload file");
//     } finally {
//       setLoading(false);
//       console.log("File upload request completed.");
//     }
//   };

//   return (
//     <div className="p-8 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Cloudinary Image Test</h1>

//       {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}

//       {/* Get Link */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold">Get Link</h2>
//         <input
//           type="text"
//           placeholder="Enter fetch URL"
//           className="border p-2 w-full mb-4"
//           value={fetchUrl}
//           onChange={(e) => setFetchUrl(e.target.value)}
//         />
//         <button
//           onClick={handleGetLink}
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           disabled={loading}
//         >
//           Get Link
//         </button>
//         {getLinkResult && (
//           <div className="mt-4">
//             <p className="font-semibold">Generated Link:</p>
//             <a href={getLinkResult} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//               {getLinkResult}
//             </a>
//           </div>
//         )}
//       </div>

//       {/* Post Link */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold">Post Link</h2>
//         <input
//           type="text"
//           placeholder="Enter input URL"
//           className="border p-2 w-full mb-2"
//           value={inputUrl}
//           onChange={(e) => setInputUrl(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter tags (comma-separated)"
//           className="border p-2 w-full mb-4"
//           value={tags}
//           onChange={(e) => setTags(e.target.value)}
//         />
//         <button
//           onClick={handlePostLink}
//           className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//           disabled={loading}
//         >
//           Upload Image from URL
//         </button>
//         {postLinkResult && (
//           <div className="mt-4">
//             <p className="font-semibold">Uploaded Image Link:</p>
//             <a href={postLinkResult} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
//               {postLinkResult}
//             </a>
//           </div>
//         )}
//       </div>

//       {/* Drop Image */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold">Drop Image to Upload</h2>
//         <div
//           {...getRootProps()}
//           className={`border-dashed border-2 p-6 rounded cursor-pointer ${
//             isDragActive ? "border-blue-500" : "border-gray-400"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? <p>Drop the image here...</p> : <p>Drag and drop an image here, or click to select one</p>}
//         </div>
//         {file && (
//           <div className="mt-4">
//             <p className="font-semibold">Selected File:</p>
//             <p>{file.name}</p>
//             <input
//               type="text"
//               placeholder="Enter tags (comma-separated)"
//               className="border p-2 w-full mb-2"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//             />
//             <button
//               onClick={handleUploadFile}
//               className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 mt-2"
//               disabled={loading}
//             >
//               Upload File
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Test;
