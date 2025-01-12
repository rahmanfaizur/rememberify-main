import { ThinkIcon } from "../icons/ThinkIcon";

export function ErrorPage() {
    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="pl-5 md:pl-20">
                    <h1 className="font-bold text-4xl mb-4">Error 404!</h1>
                    <p className="mb-4">
                        Oops! It seems we can't find the page you're looking for. Here are some possible reasons:
                    </p>
                    <ul className="pl-4 list-disc space-y-2">
                        <li>The link you clicked might be broken or outdated.</li>
                        <li>You might have mistyped the URL. Happens to the best of us!</li>
                    </ul>
                </div>
                <div className="flex flex-col items-center">
                    <ThinkIcon size="errorPage" />
                    <p className="mt-4 text-lg text-gray-400">OOPS! AN EMPTY BRAIN!</p>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-center py-4">
                <p className="mb-2">Looking for something else?</p>
                <div className="space-x-4">
                    <a
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Go to Homepage
                    </a>
                    <a
                        href="/search"
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                        Search for Help
                    </a>
                </div>
            </div>
        </div>
    );
}
