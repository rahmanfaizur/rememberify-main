import { ButtonRounded } from "./ButtonRounded";

export default function NavbarMain() {
    return (
        <div>
            <div className="bg-my-custom-400 w-full flex text-white justify-between items-center h-20 px-6">
                <b className="text-2xl font-bold">
                    Rememberify
                </b>
                <div className="flex space-x-10">
                    <div>
                        <ButtonRounded></ButtonRounded>
                    </div>
                    <div>
                        <ButtonRounded></ButtonRounded>
                    </div>
                </div>
                </div>
        </div>
    )
}