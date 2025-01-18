import { ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import RememberifyLogo from "../../img/rememberify.png"

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProps {
  children: ReactNode;
  onToggle: (expanded: boolean) => void; // Callback for sidebar toggle
}

export default function Sidebar({ children, onToggle }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isSmScreen, setIsSmScreen] = useState(false); // Track small screen status

  // Handle toggle
  const toggleSidebar = () => {
    setExpanded((curr) => {
      const newState = !curr;
      onToggle(newState); // Notify parent
      return newState;
    });
  };

  // Detect screen size and update expanded state accordingly
  useEffect(() => {
    const handleResize = () => {
      setIsSmScreen(window.innerWidth < 700); // Check for 'sm' breakpoint (tailwind)
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize); // Update on resize
    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, []);

  // If on small screens (sm), set sidebar to collapsed state
  useEffect(() => {
    if (isSmScreen && expanded) {
      setExpanded(false); // Collapse sidebar if it's a small screen
      onToggle(false); // Notify parent that it's collapsed
    }
  }, [isSmScreen]);

  return (
    <aside className={`fixed z-50 h-screen ${expanded ? "w-72" : "w-20"} transition-all`}>
      <nav className="h-full flex flex-col text-white bg-gray-900 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex">
            <div
              className={`flex items-center overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            >
              <h1
                className={`pt-5 pl-3 font-black transition-all ${expanded ? "opacity-100" : "opacity-0"}`}
              >
                {/* Rememberify */}
                <img src={RememberifyLogo} alt="" />
              </h1>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 mr-3 rounded-lg text-white  hover:bg-black sm:block hidden"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src={`https://ui-avatars.com/api/?name=${localStorage.getItem("usernameFirstLetter")}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{localStorage.getItem("username")}</h4>
              </div>
            {/* <MoreVertical size={20} /> */}
          </div>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({ icon, text, active = false, alert = false }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a SidebarContext.Provider");
  }

  const { expanded } = context;

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group  ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-a-900"
          : "hover:bg-indigo-50 text-gray-600 hover:text-black"
      }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
        />
      )}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
