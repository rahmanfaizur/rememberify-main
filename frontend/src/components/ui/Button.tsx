import { ReactElement, useEffect } from "react";

type Variants = "primary" | "secondary" | "greeny" | "reddish" | "blacky";
interface ButtonProps {
    variant: Variants;
    size: "sm" | "md" | "lg" | "var";
    text: string;
    padding: "one";
    startIcon?: ReactElement; // React element means a React component!
    endIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    triggerOnEnter?: boolean; // Optional prop to enable Enter key trigger
}

const variantStyles = {
    "primary": "bg-purple-600 text-white hover:bg-blue-600 hover:shadow-lg",
    "secondary": "bg-purple-300 text-purple-500 hover:bg-blue-300 hover:shadow-lg",
    "greeny": "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg",
    "reddish": "bg-red-500 text-white hover:bg-red-400 hover:text-black hover:shadow-lg",
    "blacky": "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
};

const sizeStyles = {
    "sm": "py-1 px-1 font-light",
    "md": "py-2 px-4 font-light",
    "lg": "py-4 px-6",
    "var": "py-2 px-1 sm:font-bold sm:py-3 sm:px-4 hover:text-black"
};

const defaultStyles = "rounded-md flex transition-all duration-300 ease-in-out"; // Added smooth transitions

export const Button = (props: ButtonProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (props.triggerOnEnter && event.key === "Enter" && props.onClick && !props.loading) {
                event.preventDefault();
                props.onClick();
            }
        };

        if (props.triggerOnEnter) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            if (props.triggerOnEnter) {
                window.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [props.triggerOnEnter, props.onClick, props.loading]);

    return (
        <button
            onClick={props.onClick}
            className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth ? "w-full flex justify-center items-center" : ""} ${props.loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={props.loading}
        >
            <div className="flex items-center justify-center w-full">
                {props.loading ? (
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291V16c0 1.657 1.343 3 3 3h1v-1.709A7.965 7.965 0 016 14.708z"
                            ></path>
                        </svg>
                    </div>
                ) : (
                    <div className="flex items-center">
                        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
                        {props.text}
                        {props.endIcon ? <div className="pl-2">{props.endIcon}</div> : null}
                    </div>
                )}
            </div>
        </button>
    );
};
