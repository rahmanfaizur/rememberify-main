import { ReactElement } from "react";

type Variants = "primary" | "secondary" | "greeny" | "reddish";
interface ButtonProps {
    variant: Variants;
    size: "sm" | "md" | "lg";
    text: string;
    padding: "one"
    startIcon?: ReactElement; //react element means a react component!
    endIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean; 
}

const variantStyles = {
    "primary": "bg-purple-600 text-white",
    "secondary": "bg-purple-300 text-purple-500",
    "greeny": "bg-green-500 text-white",
    "reddish": "bg-red-500 text-white",
    "blacky": "bg-black text-white"
}

const sizeStyles = {
    "sm": "py-1 px-2 font-light",
    "md": "py-2 px-4 font-light",
    "lg": "py-4 px-6"
}

const defaultStyles = "rounded-md flex"
export const Button = (props: ButtonProps) => {
    //props.variant, props.onClick....
    return <button onClick={props.onClick} className={`${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]} ${props.fullWidth ? "w-full flex justify-center items-center" : "" } ${props.loading ? "opacity-45" : ""}`} disabled={props.loading}>
        <div className='flex'>
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
        {props.text}
        {props.endIcon}
        </div>
    </button>
}