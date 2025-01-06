import { toast, ToastContainer } from "react-toastify";

export default function Test() {
  const notify = () => toast("Wow so easy!");
  return (
    <div className="p-4">
      <button onClick={notify}>Notify!</button>
      <ToastContainer/>
    </div>
  );
}
