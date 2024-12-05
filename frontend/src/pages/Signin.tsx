import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {

        const usernameRef = useRef<any>(); //generics! what should go here and eventually get stored in the ref! like we can input <HTMLInputElement> as well here! tho for simplicity we use <any> type here!
        const passwordRef = useRef<any>();
        const navigate = useNavigate();
    
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


    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={usernameRef} placeholder="username"/>
            <Input reference={passwordRef} placeholder="password"/>
            <div className="flex justify-center p-4">
            <Button variant="primary" text="Signin" size="md" fullWidth={true} loading={false} onClick={Signin}/>
            </div>
        </div>
    </div>
}