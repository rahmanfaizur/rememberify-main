import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import PasswordInput from "../components/ui/PasswordInput";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function alreadyUser() {
        navigate("/signin");
    }

    async function Signup() {
        try {
            const username = usernameRef.current?.value?.trim(); // Trim whitespace
            const password = passwordRef.current?.value;

            // Validate username
            if (!username || username.length < 1) {
                setErrorMessage("Username cannot be empty or too short.");
                return;
            }

            // console.log(errorMessage)
            // Clear previous error message
            setErrorMessage("");

            // API Call
            await axios.post(`${BACKEND_URL}/api/v1/signup`, { username, password });

            alert("You Have Signed Up!");
            navigate("/signin");
        } catch (error: any) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "An error occurred.");
                console.error("Error Response:", error.response.data);
            } else if (error.request) {
                console.error("Error Request:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        }
    }

    return (
        <div className="">
            <Navbar />
            <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
                <div className="bg-white rounded-xl border min-w-48 p-8">
                    <div className="flex flex-col items-center pb-3">
                        <h1 className="font-bold text-2xl">Welcome to Rememberify!</h1>
                        <div>Login to access your second brain!</div>
                    </div>
                    <div className="flex flex-col justify-start pt-3">
                        <div className="pl-2">Username</div>
                        <Input reference={usernameRef} placeholder="username" />
                        {errorMessage && (
                            <div className="text-red-500 text-sm pl-2">{errorMessage}</div>
                        )}
                    </div>
                    <div className="flex flex-col pt-3">
                        <div className="pl-2 pt-1">Password</div>
                        <PasswordInput reference={passwordRef} placeholder="password" />
                    </div>
                    <div className="flex justify-center p-4">
                        <Button
                            padding="one"
                            variant="primary"
                            text="Signup"
                            size="md"
                            fullWidth={true}
                            loading={false}
                            onClick={Signup}
                        />
                    </div>
                    <div className="flex justify-center">Already a user?</div>
                    <div className="flex justify-center">
                        <button
                            className="text-blue-400 hover:underline"
                            onClick={alreadyUser}
                        >
                            Sign In!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
