import { SpotifyIcon } from "../../icons/SpotifyIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SidebarItem";

export function SideBar() {
    return (
        <div>
            <div className="h-screen bg-white border-r w-72 fixed left-0 top-20 pl-4">
            <div className="">
                <SideBarItem text="Twitter" icon={<TwitterIcon size="md"/>}/>
                <SideBarItem text="Youtube" icon={<YoutubeIcon size="md"/>}/>
                <SideBarItem text="Spotify" icon={<SpotifyIcon size="lg"/>}/>
            </div>
        </div>
        </div>
    )
}