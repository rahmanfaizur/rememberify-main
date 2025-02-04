import { useNavigate } from "react-router-dom";
import { ButtonRounded } from "./ButtonRounded";

export default function NavbarMain() {
    const navigate = useNavigate();

    function navigateToSignin() {
        navigate("/signin")
    }
    function navigateToSignup() {
        navigate("/signup")
    }

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="bg-my-custom-400 flex text-white justify-between items-center h-20 px-6">
        <b className="text-2xl md:text-3xl">Rememberify</b>
        <div className="flex space-x-10">
          {/* Hide the "Sign up" button on md and below screens */}
          <div className="hidden md:block">
            <ButtonRounded text="Sign up" rounded={true} onClick={navigateToSignup} />
          </div>
          <ButtonRounded text="Sign in" onClick={navigateToSignin} />
        </div>
      </div>
    </div>
  );
}
