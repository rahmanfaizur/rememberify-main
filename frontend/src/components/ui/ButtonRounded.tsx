interface ButtonProps {
    text: string
    rounded?: boolean
    
}

export function ButtonRounded({text, rounded} : ButtonProps) {
    return (
     <div>
        <button className={`text-xl font-medium p-2 px-6 ${rounded ? "border-2 rounded-full" : ""}`}>
            {text}
        </button>
     </div>
    )
}