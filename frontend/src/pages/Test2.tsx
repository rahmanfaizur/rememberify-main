import NavbarMain from "../components/ui/NavbarMain";
import StyledText from "../components/ui/StyledText";
import PhoneStyleScroller from "../components/ui/Features";
import Footer from '../components/ui/Footer';
import { useNavigate } from "react-router-dom";

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
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-4">
          <StyledText />
          <div className="text-my-custom-400 font-normal text-base md:text-xl mt-4">
            Spend Less Time Searching, More Time Living. <br />
            Let Rememberify Do the Remembering. <br />
            <button className="bg-white py-2 px-6 md:py-3 md:px-8 rounded-full mt-4 text-lg font-bold md:text-base" onClick={navigateToSignup}>
              Let's go
            </button>
          </div>
        </div>
        {/* Right half (phone style card) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <PhoneStyleScroller />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
