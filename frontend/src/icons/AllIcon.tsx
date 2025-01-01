import { IconProps, iconSizeVariants } from ".";

export const AllIcon = (props: IconProps) => {
    return (
        <div>
            <svg className={iconSizeVariants[props.size]} version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" 
            	 viewBox="0 0 512 512" >
            <style type="text/css">
            </style>
            <g>
            	<path className="st0" d="M0,17.067V153.6h512V17.067H0z M110.933,110.925h-51.2v-51.2h51.2V110.925z"/>
            	<path className="st0" d="M0,324.267h512V187.733H0V324.267z M59.733,230.391h51.2v51.2h-51.2V230.391z"/>
            	<path className="st0" d="M0,494.933h512V358.4H0V494.933z M59.733,401.058h51.2v51.2h-51.2V401.058z"/>
            </g>
            </svg>
        </div>
    )
}