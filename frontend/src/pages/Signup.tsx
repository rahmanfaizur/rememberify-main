import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import PasswordInput from "../components/ui/PasswordInput";
import { ToastContainer, toast } from 'react-toastify';

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    function alreadyUser() {
        navigate("/signin");
    }

    function toastSignup() {
        toast.success("You Have Signed Up!");
    }

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    };

    async function Signup() {
        try {
            handleClick();
            const username = usernameRef.current?.value?.trim();
            const password = passwordRef.current?.value;

            if (!username || username.length < 1) {
                setErrorMessage("Username cannot be empty or too short.");
                return;
            }
            setErrorMessage("");

            await axios.post(`${BACKEND_URL}/api/v1/signup`, { username, password });
            toastSignup();
            const intervalId = setInterval(() => {
                navigate("/signin");
            }, 2000);
            setTimeout(() => clearInterval(intervalId), 2000);
        } catch (error: any) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "An error occurred.");
                toast.error(error.response.data.message);
                if (error.response.data.message === "Username already exists" ) {
                    toast.success("Please sign in with your credentials");
                    setTimeout(() => {
                        alreadyUser();
                    }, 2500);
                }
            }
        }
    }

    const handleGoogleSignup = async () => {
        window.location.href = `${BACKEND_URL}/auth/google`;
    };

    return (
        <div className="">
            <div className="border-b-2">
                <Navbar />
            </div>
            <div className="flex justify-center items-center h-screen w-screen bg-black text-white ">
                <div className="bg-black rounded-xl min-w-48 p-8 border-white border-2">
                    <div className="flex flex-col items-center pb-3">
                        <h1 className="font-bold text-2xl">Welcome to Rememberify!</h1>
                        <div>Login to access your second brain!</div>
                    </div>
                    <div className="flex flex-col justify-start pt-3">
                        <div className="pl-2">Username</div>
                        <div className="text-black"><Input reference={usernameRef} placeholder="username" errorMessage={errorMessage}/></div>
                        {errorMessage && (
                            <div className="text-red-500 text-sm pl-2">{errorMessage}</div>
                        )}
                    </div>
                    <div className="flex flex-col pt-3">
                        <div className="pl-2 pt-1">Password</div>
                        <div className="text-black"><PasswordInput reference={passwordRef} placeholder="password" /></div>
                    </div>
                    <div className="flex justify-center p-4">
                        <Button
                            padding="one"
                            variant="primary"
                            text="Signup"
                            size="md"
                            fullWidth={true}
                            loading={loading}
                            onClick={Signup}
                            triggerOnEnter={true}
                        />
                        <ToastContainer></ToastContainer>
                    </div>
                    <div className="flex justify-center pb-2">Or</div>
                    <div className="flex justify-center pb-4">
                        <Button
                            padding="one"
                            variant="secondary"
                            text="Signup with Google (soon)"
                            size="md"
                            fullWidth={true}
                            onClick={handleGoogleSignup}
                        />
                    </div>
                    <div className="flex justify-center">Already a user?</div>
                    <div className="flex justify-center">
                        <button
                            className="text-blue-400 hover:underline"
                            onClick={alreadyUser}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
