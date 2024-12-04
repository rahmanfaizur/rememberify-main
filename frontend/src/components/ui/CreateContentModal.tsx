import { useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";

export function CreateContentModal({ open, onClose}) { //controlled component!
    // const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            {/* <CrossIcon onClick={() => {
                //since its defined outside￼
￼
 we send a signal to the parent component!
                // we need a popup ui above!

            }}/> */}
            {open && <div className="w-screen h-screen bg-slate-200 fixed top-0 left-0 opacity-60 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="bg-white opacity-100 p-4 rounded">
                        <div className="flex justify-end">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon size="md"/>   
                            </div>
                        </div>
                        <div>
                         <Input placeholder={"title"}/>
                         <Input placeholder={"link"}/>
                        </div>
                        <div className="flex justify-center"><Button variant="primary" text="Submit" size="md"/></div>
                    </span>
                </div>
            </div>}
        </div>
    )
}

function Input({onChange, placeholder} :  {onChange: () => void}) {
    return (
        <div>
            <input placeholder={placeholder} type="text" className="px-4 py-2 border rounded m-2" onChange={onChange}/>
        </div>
    )
}