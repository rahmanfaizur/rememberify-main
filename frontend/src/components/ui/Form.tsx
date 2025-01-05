import { useState } from "react";

const Form = () => {
  // Declare state variable 'input' to store the input value, and 'setInput' to update it.
  const [input, setInput] = useState("");

  // This function is called when the submit button is clicked (or Enter is pressed).
  const handleSubmit = () => {
    // Display an alert when the form is submitted
    alert("Form Submitted!");
  };

  // This function is called when the user types something in the input field.
  const handleInputChange = (e: any) => {
    // Update the 'input' state with the new value from the input field
    setInput(e.target.value);
  };

  return (
    <div>
      {/* Input field where the user types something */}
      <input
        type="text"
        value={input} // Bind the 'input' state to the value of the input field
        onChange={handleInputChange} // Call 'handleInputChange' when the user types
        placeholder="Type something" // Placeholder text for the input field
        // Listen for key down events (when the user presses a key inside the input)
        onKeyDown={(e) => {
          // Check if the pressed key is the 'Enter' key
          if (e.key === "Enter") {
            // If Enter is pressed, call the 'handleSubmit' function (submit the form)
            handleSubmit();
          }
        }}
      />
      {/* Button to submit the form */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Form;
