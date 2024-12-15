import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export function Signin() {

        const usernameRef = useRef<any>(); //generics! what should go here and eventually get stored in the ref! like we can input <HTMLInputElement> as well here! tho for simplicity we use <any> type here!
        const passwordRef = useRef<any>();
        const navigate = useNavigate();
        function newUser() {
            navigate('/signup');
        }
    
        async function Signin() {
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                    username,
                    password
            });
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            // console.log(localStorage.getItem("token"));
            navigate("/dashboard")
            // redirect the user to the dashboard!
            alert("You Have Logged In!");
        }

    return <div>
        <Navbar></Navbar>
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
        <div className="flex flex-col items-center  pb-3">
                <h1 className="font-bold text-2xl">Welcome to Rememberify!</h1>
                <div>Login to access your second brain!</div>
            </div>
            <div className="flex flex-col justify-start pt-3">
                <div className="pl-2">Username</div>
            <Input reference={usernameRef} placeholder="username"/>
            </div>
            <div className="flex flex-col pt-3">
                <div className="pl-2 pt-1">Password</div>
                <Input reference={passwordRef} placeholder="password"/>
            </div>
            <div className="flex justify-center p-4">
            <Button variant="primary" text="Signin" size="md" fullWidth={true} loading={false} onClick={Signin}/>
            </div>
                <div className="flex justify-center">
                    Don't have an account yet?
                </div>
            <div className="flex justify-center">
                <button className="text-blue-400" onClick={newUser}>Sign Up</button>
            </div>
        </div>
    </div>
    </div>
}

// export { newUser }