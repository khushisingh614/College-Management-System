import {
    MoreVertical,
    ChevronLast,
    ChevronFirst
  } from "lucide-react";
  import { useContext, createContext, useState } from "react";
  
  const SidebarContext = createContext();
  
  export default function Sidebar({ children, allowedTabs = []  }) {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          {/* Header */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
  
          {/* Menu */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    );
  }
  
  export function SidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);
  
    return (
      <li
        onClick={onClick}
        className={`relative flex items-center py-2 px-3 my-1 cursor-pointer rounded-md transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-400 to-indigo-600 text-black"
              : "hover:bg-indigo-200 text-gray-600"
          }`}
      >
        {icon}
        <span
          className={`overflow-hidden whitespace-nowrap transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
  
        {/* Alert dot */}
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-500 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
  
        {/* Tooltip for collapsed state */}
        {!expanded && (
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 rounded-md bg-indigo-600 text-white text-sm whitespace-nowrap
              opacity-0 -translate-x-2 pointer-events-none
              group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:pointer-events-auto
              transition-all ease-in-out border border-white"
          >
            {text}
          </div>
        )}

      </li>
    );
  }