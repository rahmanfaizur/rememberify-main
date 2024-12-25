import { IconProps, iconSizeVariants } from "."

export const NavIcon = (props: IconProps) => {
    return (
        <div>
            <svg className={iconSizeVariants[props.size]} fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
            	 viewBox="0 0 377 377">
            <g>
            	<rect x="75" y="73.5" width="302" height="30"/>
            	<rect y="73.5" width="30" height="30"/>
            	<rect y="273.5" width="30" height="30"/>
            	<rect x="75" y="273.5" width="302" height="30"/>
            	<rect y="173.5" width="30" height="30"/>
            	<rect x="75" y="173.5" width="302" height="30"/>
            </g>
            </svg>
        </div>
    )
}