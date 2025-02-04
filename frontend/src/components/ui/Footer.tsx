export default function Footer() {
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-my-custom-400 py-2">
        <div className="container mx-auto text-center text-white text-sm">
          <a href="/about" className="mx-2 hover:underline">
            About Us
          </a>
          <a href="/terms" className="mx-2 hover:underline">
            Terms
          </a>
          <a href="/privacy" className="mx-2 hover:underline">
            Privacy
          </a>
        </div>
      </footer>
    );
  }
  