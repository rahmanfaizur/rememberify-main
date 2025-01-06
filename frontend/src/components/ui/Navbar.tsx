import { useNavigate, useLocation } from "react-router-dom";
import { BrainIcon } from "../../icons/BrainIcon";
import { Button } from "./Button";
import { LogoutIcon } from "../../icons/LogoutIcon";

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const newUser = () => navigate('/signup');
    const existingUser = () => navigate('/signin');
    
    const LogoutItem = () => {
        localStorage.removeItem('token');
        navigate('/signup');
    };

    const isAuthPage = location.pathname === "/signup" || location.pathname === "/signin";
    const isDashboardPage = location.pathname === "/dashboard";

    return (
        <div className="p-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg rounded-lg">
            <div className="flex items-center justify-between text-xl md:text-2xl text-white font-semibold">
                {/* Brain Icon */}
                <div className="pr-2 text-yellow-200 hover:text-yellow-300 transition-all duration-300">
                    <BrainIcon size="lg" />
                </div>
                
                <div className="flex-grow text-center md:text-left">Rememberify</div>

                <div className="ml-auto flex gap-4 items-center">
                    {/* Render Logout button if not on auth pages */}
                    {!isAuthPage && (
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

                    {/* Only render Signup and Login buttons if not on dashboard or auth pages */}
                    {!isAuthPage && !isDashboardPage && (
                        <>
                            <button className="transition-all duration-300 transform hover:scale-105">
                                <Button 
                                    padding="one" 
                                    variant="primary" 
                                    size="md" 
                                    text="Signup" 
                                    onClick={newUser} 
                                />
                            </button>
                            
                            <button className="transition-all duration-300 transform hover:scale-105">
                                <Button 
                                    padding="one" 
                                    variant="primary" 
                                    size="md" 
                                    text="Login" 
                                    onClick={existingUser} 
                                />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
