import { ButtonRounded } from "./ButtonRounded";

export default function NavbarMain() {
    return (
        <div>
            <div className="bg-my-custom-400 w-full flex text-white justify-between items-center h-20 px-6 fixed">
                <b className="text-3xl">
                    Rememberify
                </b>
                <div className="flex space-x-10">
                    <div>
                        <ButtonRounded text="Sign in" rounded={true}></ButtonRounded>
                    </div>
                    <div>
                        <ButtonRounded text="Sign up"></ButtonRounded>
                    </div>
                </div>
                </div>
        </div>
    )
}