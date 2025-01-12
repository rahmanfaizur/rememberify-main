import { useNavigate } from "react-router-dom";
import { BrainIcon } from "../../icons/BrainIcon";
import { Button } from "./Button";
import { LogoutIcon } from "../../icons/LogoutIcon";

// Define the props interface
interface NavbarProps {
    showSignup?: boolean;
    showSignin?: boolean;
    showLogout?: boolean;
}

export function Navbar({
    showSignup,
    showSignin,
    showLogout,
}: NavbarProps) {
    const navigate = useNavigate();

    const newUser = () => navigate('/signup');
    const existingUser = () => navigate('/signin');

    const LogoutItem = () => {
        localStorage.removeItem('token');
        navigate('/signup');
    };

    return (
        <div className="p-4 bg-black text-white shadow-lg border-b-1 border-white">
            <div className="flex items-center justify-between text-xl md:text-2xl font-semibold">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="text-blue-400 hover:text-blue-500 transition-all duration-300">
                        <BrainIcon size="lg" />
                    </div>
                    <span className="text-lg md:text-2xl font-bold">Rememberify</span>
                </div>

                {/* Navigation Actions */}
                <div className="ml-auto flex gap-4 items-center">
                    {/* Render Logout button based on prop */}
                    {showLogout && (
                        <button className="transition-all duration-300 transform hover:scale-105">
                            <Button
                                padding="one"
                                text="Logout"
                                variant="reddish"
                                size="md"
                                startIcon={<LogoutIcon size="lg" />}
                                onClick={LogoutItem}
                            />
                        </button>
                    )}

                    {/* Render Signup button based on prop */}
                    {showSignup && (
                        <button className="transition-all duration-300 transform hover:scale-105">
                            <Button
                                padding="one"
                                variant="primary"
                                size="md"
                                text="Signup"
                                onClick={newUser}
                            />
                        </button>
                    )}

                    {/* Render Signin button based on prop */}
                    {showSignin && (
                        <button className="transition-all duration-300 transform hover:scale-105">
                            <Button
                                padding="one"
                                variant="primary"
                                size="md"
                                text="Login"
                                onClick={existingUser}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
