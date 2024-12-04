import { ReactElement } from "react";

interface Items {
    text: String,
    icon: ReactElement
}


export function SideBarItem(props : Items) {
    return (
        <div className="flex items-center text-slate-800 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4 transition-all">
            <div className="pr-2 py-2">
                {props.icon}
            </div>
            <div>
                {props.text}
            </div>
        </div>
    )
}