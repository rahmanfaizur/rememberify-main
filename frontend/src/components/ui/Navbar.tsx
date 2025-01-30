import { useNavigate } from "react-router-dom";
// import { BrainIcon } from "../../icons/BrainIcon";
import { Button } from "./Button";
import { LogoutIcon } from "../../icons/LogoutIcon";
import FavIcon from "../../img/rememberify.png"
import { toast } from "react-toastify";
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

  const newUser = () => navigate("/signup");
  const existingUser = () => navigate("/signin");

  const LogoutItem = () => {
    localStorage.removeItem("token");
    toast.error("Logging Out!")
    setTimeout(() => {
      navigate("/signup");
    }, 1500); // 1.5 seconds delay
  };


  return (
    <div className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img className="w-40 h-15" src={FavIcon} alt="" />
          {/* <div className="text-blue-400 hover:text-blue-500 transition-all duration-300">
            <BrainIcon size="lg" />
          </div>
          <span className="text-2xl font-extrabold tracking-wide">
            Rememberify
          </span> */}
        </div>

        {/* Navigation Actions */}
        <div className="flex gap-4 items-center">
          {showLogout && (
            <button className="transform hover:scale-105 transition-all duration-300">
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
            <button className="transform hover:scale-105 transition-all duration-300">
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
            <button className="transform hover:scale-105 transition-all duration-300">
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