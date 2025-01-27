import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { LogoutIcon } from "../../icons/LogoutIcon";
import FavIcon from "../../img/rememberify.png";
import { toast } from "react-toastify";

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

  const newUser = () => navigate("/signup");
  const existingUser = () => navigate("/signin");

  const LogoutItem = () => {
    localStorage.removeItem("token");
    toast.error("Logging Out!");
    setTimeout(() => {
      navigate("/signup");
    }, 1500); // 1.5 seconds delay
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white shadow-md rounded-b-2xl">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img className="w-36 h-auto object-contain" src={FavIcon} alt="Rememberify Logo" />
        </div>

        {/* Navigation Actions */}
        <div className="flex gap-4 items-center">
          {showLogout && (
            <button
              className="transition-transform transform hover:scale-110 focus:scale-95 focus:outline-none"
              aria-label="Logout"
            >
              <Button
                padding="one"
                text="Logout"
                variant="reddish"
                size="var"
                startIcon={<LogoutIcon size="lg" />}
                onClick={LogoutItem}
              />
            </button>
          )}

          {showSignup && (
            <button
              className="transition-transform transform hover:scale-110 focus:scale-95 focus:outline-none"
              aria-label="Signup"
            >
              <Button
                padding="one"
                variant="primary"
                size="var"
                text="Signup"
                onClick={newUser}
              />
            </button>
          )}

          {showSignin && (
            <button
              className="transition-transform transform hover:scale-110 focus:scale-95 focus:outline-none"
              aria-label="Login"
            >
              <Button
                padding="one"
                variant="primary"
                size="var"
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
