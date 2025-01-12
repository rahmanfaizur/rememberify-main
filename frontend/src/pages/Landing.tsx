import { Navbar } from "../components/ui/Navbar";

export function Landing() {
    return (
        <div className="h-screen bg-gray-800 text-white">
            <Navbar showSignin={true} showSignup={true}></Navbar>
            <div>More content incoming!</div>
        </div>
    )
}