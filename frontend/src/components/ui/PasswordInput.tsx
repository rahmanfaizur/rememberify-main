import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordInput({ reference, placeholder, errorMessage }: any) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative max-w-[calc(100%-16px)]">  {/* Adjust width */}
            <input
                ref={reference}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded m-2 pr-14 ${errorMessage ? "border-red-500" : "border-gray-300"}`} // Adjust padding-right for eye icon
            />
            <div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
        </div>
    );
}

export default PasswordInput;
