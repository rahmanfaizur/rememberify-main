
interface CardProps {
    title: string,
    tags: string[],
    link: string,
    type: "twitter" | "youtube"
}

import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";

export function Card({title, link, type} : CardProps) {
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
                    <a href={link} target="_blank"></a>
                <ShareIcon size="md"/>
                </div>
                <div className="text-gray-500">
                <DeleteIcon size="md" />
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