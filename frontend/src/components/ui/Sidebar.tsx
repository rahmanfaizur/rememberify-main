import { BrainIcon } from "../../icons/BrainIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SidebarItem";

export function SideBar() {
    return (
        <div className="h-screen bg-white border-r w-72 fixed left-0 top-0 pl-4">
            <div className="flex text-2xl pb-4 pt-4">
                <div className="pr-4 text-purple-600">
                    <BrainIcon size="xl"/>
                </div>
                Rememberify
            </div>
            <div>
                <SideBarItem text="Twitter" icon={<TwitterIcon/>}/>
                <SideBarItem text="Youtube" icon={<YoutubeIcon/>}/>
            </div>
        </div>
    )
}