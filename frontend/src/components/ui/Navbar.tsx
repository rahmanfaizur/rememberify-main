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
        <div className="p-4 bg-black text-white shadow-lg border-b-2 border-white">
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

                    {/* Signup and Login buttons */}
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
