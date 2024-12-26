export function Input({ placeholder, reference }: { placeholder: string; reference: any }) {
    return (
        <div className="max-w-[calc(100%-16px)]"> {/* Adjust width */}
            <input
                placeholder={placeholder}
                type="text"
                className="w-full px-4 py-2 border rounded m-2"
                ref={reference}
            />
        </div>
    );
}
