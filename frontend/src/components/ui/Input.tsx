export function Input({
    placeholder,
    reference,
    errorMessage,
}: {
    placeholder: string;
    reference: any;
    errorMessage?: string; // Optional prop to handle error state
}) {
    return (
        <div className="max-w-[calc(100%-16px)]"> {/* Adjust width */}
            <input
                placeholder={placeholder}
                type="text"
                className={`w-full px-4 py-2 border rounded m-2 ${
                    errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                ref={reference}
            />
        </div>
    );
}
