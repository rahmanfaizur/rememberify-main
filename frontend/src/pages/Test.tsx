import { Button } from "../components/ui/Button";

export default function Test() {
  return (
    <div className="p-4">
      <Button
        variant="primary"
        size="md"
        text="Click Me"
        padding="one"
        changeTextOnClick={true}
        newText="Signin In!"
        changeColorOnClick={true}
        newVariant="lightBlue"
      />
    </div>
  );
}
