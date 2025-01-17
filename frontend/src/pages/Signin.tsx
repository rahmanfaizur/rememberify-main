import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import PasswordInput from "../components/ui/PasswordInput";
import { toast, ToastContainer } from "react-toastify";

export function Signin() {
    const usernameRef = useRef<any>();
    const passwordRef = useRef<any>();
    const navigate = useNavigate();
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Redirects the user to the signup page
    function newUser() {
        navigate('/signup');
    }

    // Displays a success toast for login
    function toastLogin() {
        toast.success("You Have Logged In!");
    }

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true); // Set loading to true
        setTimeout(() => {
            setLoading(false); // Reset loading after 2 seconds
            // alert("Button Clicked!"); // Simulate some action
        }, 2000); // Simulate a delay (e.g., API call)
    }; 

    // Handles the Signin process
    async function Signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username) {
            setUserError("Username cannot be empty!");
        }

        try {
            handleClick();
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password,
            });
            toastLogin();
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);

            // Store the first letter of the username in localStorage
            if (username) {
                const firstLetter = username.charAt(0);
                localStorage.setItem("username", username);
                localStorage.setItem("usernameFirstLetter", firstLetter);
                // console.log(firstLetter);
                // console.log(username);
            }

            // Redirect to dashboard every 3 seconds using setInterval
            const intervalId = setInterval(() => {
                navigate("/dashboard");
                console.log("Navigating to dashboard...");
            }, 2000);

            // Stop the interval when the component unmounts or as needed
            setTimeout(() => clearInterval(intervalId), 3000); // Clear after one navigation

        } catch (error: any) {
            if (error.response) {
                if (error.response.data.type === "username") {
                    setUserError(error.response.data.message);
                    toast.error(error.response.data.message); // Display error toast for username
                } else if (error.response.data.type === "password") {
                    setPasswordError(error.response.data.message);
                    toast.error(error.response.data.message); // Display error toast for password
                }
            } else if (error.request) {
                // console.log("Error request:", error.request);
                toast.error("Network error. Please try again.");
            } else {
                // console.log("Error message:", error.message);
                toast.error("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <div>
            <div className="border-b-2">
            <Navbar />
            </div>
            <div className="h-screen w-screen bg-black text-white flex justify-center items-center">
                <div className="bg-black rounded-xl border-2 min-w-48 p-8">
                    <div className="flex flex-col items-center pb-3">
                        <h1 className="font-bold text-2xl">Welcome to Rememberify!</h1>
                        <div>Login to access your second brain!</div>
                    </div>
                    <div className="flex flex-col justify-start pt-3">
                        <label htmlFor="username" className="pl-2">Username</label>
                        <div className="text-black"><Input reference={usernameRef} placeholder="username" errorMessage={userError} /></div>
                        {userError && (
                            <span className="text-red-500 text-sm pl-2 mt-1">
                                {userError}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col pt-3">
                        <label htmlFor="password" className="pl-2">Password</label>
                        <div className="text-black"><PasswordInput reference={passwordRef} placeholder="password" errorMessage={passwordError} /></div>
                        {passwordError && (
                            <span className="text-red-500 text-sm pl-2 mt-1">
                                {passwordError}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-center p-4">
                        <Button
                            padding="one"
                            variant="primary"
                            text="Signin"
                            size="md"
                            fullWidth={true}
                            loading={loading}
                            onClick={Signin}
                            triggerOnEnter={true}
                        />
                        <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        // transition={Slide}
                        />
                    </div>
                    <div className="flex justify-center">
                        Don't have an account yet?
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="text-blue-400 hover:underline"
                            onClick={newUser}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
