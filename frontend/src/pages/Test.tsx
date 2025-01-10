// import { useState } from "react";
// import { Button } from "../components/ui/Button";

import { LinkIcon } from "../icons/LinkIcon";

export default function Test() {
  // const [loading, setLoading] = useState(false);

  // const handleClick = () => {
  //     setLoading(true); // Set loading to true
  //     setTimeout(() => {
  //         setLoading(false); // Reset loading after 2 seconds
  //         alert("Button Clicked!"); // Simulate some action
  //     }, 2000); // Simulate a delay (e.g., API call)
  // };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          {/* <h1 className="text-2xl font-bold mb-4">Test the Button Component</h1>
          <Button
        variant="primary"
        size="md"
        text="Click Me"
        onClick={handleClick}
        loading={loading}
        fullWidth={false} // Set to <LinkIcon size="md"></LinkIcon>true if you want the button to stretch
        padding={"one"}          /> */}
        Open Endpoint!
        <LinkIcon size="md"></LinkIcon>
      </div>
  );
}
