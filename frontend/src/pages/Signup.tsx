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
    // Refs to access the DOM elements of username and password input fields
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    //states that store the error messages!
    const [errorMessage, setErrorMessage] = useState("");
    // useNavigate hook for navigation between pages 
    const navigate = useNavigate();

    function alreadyUser() {
        navigate("/signin");
    }

    function toastSignup() {
        // console.log('111111111111111111')
        toast.success("You Have Signed Up!");
    }

    // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key === "Enter") {
    //       event.preventDefault(); // Prevent default behavior
    //       Signup();
    //     }
    //   };

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true); // Set loading to true
        setTimeout(() => {
            setLoading(false); // Reset loading after 2 seconds
            // alert("Button Clicked!"); // Simulate some action
        }, 1500); // Simulate a delay (e.g., API call)
    }; 

    async function Signup() {
        try {
            handleClick();
            //extracting values from input fields and trimming the whitespace!
            const username = usernameRef.current?.value?.trim(); // Trim whitespace
            const password = passwordRef.current?.value;

            // Validate username
            if (!username || username.length < 1) {
                setErrorMessage("Username cannot be empty or too short.");
                return; // Stop execution if validation fails
            }

            // console.log(errorMessage)
            // Clear previous error message
            setErrorMessage("");

            // API Call to backend for user Signup!
            await axios.post(`${BACKEND_URL}/api/v1/signup`, { username, password });
            
            // console.log("signed up!");
            // alert("You Have Signed Up!");
            toastSignup();
            const intervalId = setInterval(() => {
                navigate("/signin");
                // console.log("Navigating to Signin page...");
            }, 2000);

            // Stop the interval when the component unmounts or as needed
            setTimeout(() => clearInterval(intervalId), 2000);
        } catch (error: any) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "An error occurred.");
                // console.error("Error Response:", error.response.data);
                // console.log("Error Response:", error.response.data.message);
                toast.error(error.response.data.message);
                if (error.response.data.message === "Username already exists" ) {
                    toast.success("Please sign in with your credentials")
                    setTimeout(() => {
                        alreadyUser();
                    }, 2500);
                }
            }
        }
    }

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
