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
    <aside className={`fixed z-50 h-screen ${expanded ? "w-72" : "w-20"} transition-all duration-300`}>
      <nav className="h-full flex flex-col bg-gray-950 border-r border-gray-800/60 shadow-xl backdrop-blur-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex">
            <div className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <img 
                  src={RememberifyLogo} 
                  alt="Rememberify Logo"
                  className="transition-transform duration-300 hover:scale-105" 
                />
              </div>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 mr-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group"
          >
            {expanded ? (
              <ChevronFirst className="text-indigo-400 group-hover:text-purple-300 w-6 h-6 transition-colors" />
            ) : (
              <ChevronLast className="text-indigo-400 group-hover:text-purple-300 w-6 h-6 transition-colors" />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-1">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-800/60 flex p-3 bg-gray-900/30">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${localStorage.getItem("usernameFirstLetter")}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-lg ring-2 ring-indigo-500/50 transition-all duration-300 hover:ring-purple-500/70"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-gray-950" />
          </div>
          <div
            className={`flex items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-medium text-gray-200">{localStorage.getItem("username")}</h4>
              <span className="text-xs text-gray-400">Premium Member</span>
            </div>
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
