import { ReactElement } from "react";

type Variants = "primary" | "secondary" | "greeny" | "reddish" | "blacky";
interface ButtonProps {
    variant: Variants;
    size: "sm" | "md" | "lg";
    text: string;
    padding: "one";
    startIcon?: ReactElement; // React element means a React component!
    endIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const variantStyles = {
    "primary": "bg-purple-600 text-white hover:bg-blue-600 hover:shadow-lg",
    "secondary": "bg-purple-300 text-purple-500 hover:bg-blue-300 hover:shadow-lg",
    "greeny": "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg",
    "reddish": "bg-red-500 text-white hover:bg-red-400 hover:text-black hover:shadow-lg",
    "blacky": "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
};

const sizeStyles = {
    "sm": "py-1 px-2 font-light",
    "md": "py-2 px-4 font-light",
    "lg": "py-4 px-6"
};

const defaultStyles = "rounded-md flex transition-all duration-300 ease-in-out"; // Added smooth transitions

export const Button = (props: ButtonProps) => {
    return (
        <button
            onClick={props.onClick}
            className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth ? "w-full flex justify-center items-center" : ""} ${props.loading ? "opacity-45" : ""}`}
            disabled={props.loading}
        >
            <div className="flex">
                {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
                {props.text}
                {props.endIcon}
            </div>
        </button>
    );
};
