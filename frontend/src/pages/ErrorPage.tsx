import { ThinkIcon } from "../icons/ThinkIcon";

export function ErrorPage() {
    return (
        <div className="bg-gray-900 text-white h-screen grid grid-cols-2 gap-5 items-center">
        <div className="pl-20" >
        <div className="font-bold text-3xl">Error 404!</div>
        <li className="pl-4">
            <li>fjnds</li>
            <li>fjnds</li>
        </li>
        </div>
        <ThinkIcon size="errorPage"></ThinkIcon>
        </div>
    )
}