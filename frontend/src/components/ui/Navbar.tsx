import { BrainIcon } from "../../icons/BrainIcon";
import { Button } from "./Button";

export function Navbar() {
    return (
        <div className="p-4">
            <div className="flex items-center text-2xl">
                <div className="pr-4 text-purple-600">
                    <BrainIcon size="lg" />
                </div>
                <div className="flex-grow">Rememberify</div>
                <div className="ml-auto flex gap-2">
                    <Button text="Signup" />
                    <Button text="Signin" />
                </div>
            </div>
        </div>
    );
}
