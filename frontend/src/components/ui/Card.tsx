
interface CardProps {
    title: string,
    tags: string[],
    link: string,
    type: "twitter" | "youtube"
}

import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";

// async function onDeleteCompy(cdIn: any) {
    // try {
    //   // Fetch the content to retrieve the ID
    //   const res1 = await axios.get(`${BACKEND_URL}/api/v1/content`, {
    //     headers: {
    //       Authorization: localStorage.getItem("token"),
    //     },
    //   });
  
    //   const idPass = res1.data.content[cdIn]._id;
    //   console.log(idPass);
  
    //   // Perform the delete operation
    //   await axios.delete(`${BACKEND_URL}/api/v1/content`, {
    //     data: { Id: idPass }, // Pass the ID as JSON in the 'data' field
    //     headers: {
    //       Authorization: localStorage.getItem("token"),
    //     },
    //   });
    //   console.log("Delete successful", res1.data.content[cdIn].title);
      
    // } catch (error) {
    //   console.error("Error in deletion process:", error);
    // }
  // }
  

export function Card({title, link, type} : CardProps) {

  const handleDelete = () => {
    axios.delete(`${BACKEND_URL}/api/v1/content`, {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      data: {
        title,
        link,
        type
      }
    })
    .then(response => {
      console.log(response.data.message); // Optional: handle success
    })
    .catch(error => {
      console.error("Error deleting content:", error); // Optional: handle error
    });
  };  

    return <div className="p-8 bg-white rounded-md border-gray-200 border max-w-72 min-48 min-w-72 gap-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center font-semibold">
                <div className="text-gray-500 pr-2">
                {type === "twitter" && <TwitterIcon size="md"/>}
                {type === "youtube" && <YoutubeIcon size="md"/>}
                </div>
                {title}
            </div>
            <div className="flex items-center">
                <div className="pr-2 text-gray-500">
                    <a href={link} target="_blank">
                    <ShareIcon size="md"/>
                    </a>
                </div>
                <div className="text-gray-500">
                <button onClick={() => handleDelete()}>
                    <DeleteIcon size="md" />
                </button>
                </div>
            </div>
        </div>
        <div className="pt-4">
        {type === "youtube" && <iframe className="w-full" src={link.replace('watch', 'embed').replace("?v=", "/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        }
        {type === "twitter" && <blockquote className="twitter-tweet">
            <a href={link.replace('x.com', 'twitter.com')}></a> 
        </blockquote>}
        </div>
    </div>
}