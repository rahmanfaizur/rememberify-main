import { useNavigate } from "react-router-dom";
import NavbarMain from "../components/ui/NavbarMain";
import StyledText from "../components/ui/StyledText";
import PhoneStyleScroller from "../components/ui/Features";
import Footer from '../components/ui/Footer';

export default function Test2() {
  const navigate = useNavigate();

  function navigateToSignup() {
    navigate('/signup');
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <NavbarMain />
      <div className="bg-my-custom-100 min-h-screen w-full pt-20 flex flex-col md:flex-row">
        {/* Left half (primary content) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4">
          <StyledText />
          <div className="mt-8 text-my-custom-400">
            <p className="font-normal text-base md:text-xl">
              Spend Less Time Searching, More Time Living.
            </p>
            <p className="font-normal text-base md:text-xl mt-2">
              Let Rememberify Do the Remembering.
            </p>
            <button 
              className="bg-white py-2 px-6 md:py-3 md:px-8 rounded-full mt-6 text-lg font-bold md:text-base" 
              onClick={navigateToSignup}
            >
              Let's go
            </button>
          </div>
        </div>
        {/* Right half (phone style card) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-4">
          <PhoneStyleScroller />
        </div>
      </div>
      <Footer />
    </div>
  );
}
