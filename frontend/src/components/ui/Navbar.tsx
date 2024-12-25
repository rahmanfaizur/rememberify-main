import { useNavigate, useLocation } from "react-router-dom";
import { BrainIcon } from "../../icons/BrainIcon";
import { Button } from "./Button";
import { NavIcon } from "../../icons/NavIcon";
import { LogoutIcon } from "../../icons/LogoutIcon";

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    function newUser() {
        navigate('/signup');
    }

    function existingUser() {
        navigate('/signin');
    }

    function LogoutItem() {
        localStorage.removeItem('token');
        navigate('/signup');
    }

    const isAuthPage = location.pathname === "/signup" || location.pathname === "/signin";
    const isDashboardPage = location.pathname === "/dashboard";

    return (
        <div className="p-4 bg-blue-200">
            <div className="flex items-center text-xl md:text-2xl">
                {/* Only render NavIcon if not on auth pages */}
                {!isAuthPage && <NavIcon size="lg" />}
                <div className="pr-1 text-purple-600 pl-2">
                    <BrainIcon size="lg" />
                </div>
                <div className="flex-grow">Rememberify</div>
                <div className="ml-auto flex gap-2">
                    {/* Render Logout button if not on auth pages */}
                    {!isAuthPage && (
                        <Button
                            padding="one"
                            text="Logout"
                            variant="reddish"
                            size="md"
                            startIcon={<LogoutIcon size="lg" />}
                            onClick={LogoutItem}
                        />
                    )}
                    {/* Only render Signup and Login buttons if not on dashboard or auth pages */}
                    {!isAuthPage && !isDashboardPage && (
                        <>
                            <Button padding="one" variant="primary" size="md" text="Signup" onClick={newUser} />
                            <Button padding="one" variant="primary" size="md" text="Login" onClick={existingUser} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}    
