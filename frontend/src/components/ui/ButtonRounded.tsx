interface ButtonProps {
    text: string;
    rounded?: boolean;
    visible?: boolean;
    onClick?: () => void;  // Added onClick prop
  }
  
  export function ButtonRounded({ text, rounded, visible = true, onClick }: ButtonProps) {
    if (!visible) return null;
  
    return (
      <div>
        <button
          onClick={onClick}
          className={`
            text-lg md:text-xl font-medium
            p-1 md:p-2 px-4 md:px-6
            ${rounded ? "border-2 rounded-full" : ""}
            transition-colors duration-300
            text-white hover:text-purple-300
          `}
        >
          {text}
        </button>
      </div>
    );
  }
  