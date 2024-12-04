import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Signup() {
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input placeholder="username"/>
            <Input placeholder="password"/>
            <div className="flex justify-center p-4">
            <Button variant="primary" text="Signup" size="md" fullWidth={true} loading={true}/>
            </div>
        </div>
    </div>
}