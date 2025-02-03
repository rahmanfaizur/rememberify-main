import NavbarMain from "../components/ui/NavbarMain";
import StyledText from "../components/ui/StyledText";

export default function Test2() {
    return (
        <div>
            <NavbarMain />
            <div className="bg-my-custom-100 min-h-screen w-full pt-16 flex">
                <div className="w-1/2 pt-40">
                    <StyledText />
                </div>
                <div className="w-1/2"></div>
            </div>
        </div>
    );
}
