import { useNavigate } from "react-router-dom";
import { BrainIcon } from "../../icons/BrainIcon";
// import { newUser } from "../../pages/Signin";
import { Button } from "./Button";
// import { newUser } from "./Links";

export function Navbar() {

    const navigate = useNavigate();
    function newUser() {
        navigate('/signup')
    }

    function existingUser() {
        navigate('/signin')
    }
    return (
        <div className="p-4 bg-blue-200">
            <div className="flex items-center text-2xl">
                <div className="pr-4 text-purple-600">
                    <BrainIcon size="lg" />
                </div>
                <div className="flex-grow">Rememberify</div>
                <div className="ml-auto flex gap-2">
                    <Button variant="primary" size="md" text="Signup" onClick={newUser} />
                    <Button variant="primary" size="md" text="Login" onClick={existingUser} />
                </div>
            </div>
        </div>
    );
}
