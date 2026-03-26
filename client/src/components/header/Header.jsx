import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { LogOut } from "lucide-react";


const BRAND = "#701a40";
const DARK = "#5a1430";
const GOLD = "#f5b041";


const Avatar = ({ initials, color = "#f5b041", size = "w-9 h-9", text = "text-sm" }) => (
  <div className={`${color} ${size} text-xs rounded-full flex items-center justify-center font-bold text-[#701a40] border-2 border-yellow-100/40 ${text} select-none shrink-0`}>
    {initials}
  </div>
);

const Header =()=>{

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    return(<>
        {/* <nav className="p-4 bg-white shadow flex gap-4">
            
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/trucks">Trucks</Link>
                <Link to="/admin/devices">Devices</Link>
        </nav> */}

        <div className=" bg-zinc-100 font-sans sticky top-0 z-[9]">
      {/* Navbar */}
      <nav
        className="w-full px-6 py-0 flex items-center justify-between h-16 shadow-lg"
        style={{ background: "#701a40" }}
      >
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          {/* Logo tile */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#701a40] font-extrabold text-lg shadow-md"
            style={{ background: " #f5b041" , }}
          >
            I
          </div>
          <div className="flex flex-col leading-tight">
            <Link to="/admin" className="flex flex-col leading-tight">
            <span
              className="font-extrabold text-sm text-white text-base"
            //   style={{ letterSpacing: "0.18em", fontFamily: "'Georgia', serif" }}
            >
              Iravya
            </span>
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "#c084a0", fontSize: "0.6rem" }}
            >
              Manager
            </span>
            </Link>
          </div>
        </div>
 
        {/* Center nav links (optional) */}
        {/* <div className="hidden md:flex items-center gap-8">
          {["Dashboard", "Projects", "Team", "Reports"].map((item) => (
            <Link
                to ="*"
              key={item}
              href="#"
              className="text-sm font-medium tracking-wide transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={e => (e.target.style.color = "rgba(255,255,255,1)")}
              onMouseLeave={e => (e.target.style.color = "rgba(255,255,255,0.55)")}
            >
              {item}
            </Link>
          ))}
        </div> */}
 
        {/* Right: Admin + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 py-1.5 rounded-full transition-all duration-150 select-none focus:outline-none"
            style={{
              background: dropdownOpen ? "transparent": "transparent",
            }}
          >
            <span className="text-xs font-semibold text-white hidden sm:block tracking-wide">
              Admin Manager
            </span>
            <Avatar initials="AM" color="bg-amber-500" size="w-9 h-9" />
        
          </button>
 
          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-42 p-1 rounded-xl shadow-2xl border overflow-hidden z-50"
              style={{
                background: "#fff",
                borderColor: "rgba(0,0,0,0.08)",
                animation: "fadeSlideDown 0.18s ease",
              }}
            >
              {/* User info header */}
              {/* <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                <Avatar initials="AM" color="bg-amber-500" size="w-9 h-9" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Admin Manager</p>
                  <p className="text-xs text-gray-400">admin@iravya.com</p>
                </div>
              </div> */}
 
              {/* Menu items */}
              {/* <div className="py-1">
                {[
                  { label: "Profile", icon: "👤" },
                  { label: "Settings", icon: "⚙️" },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-100 text-left"
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div> */}
 
              <div className="border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold transition-colors duration-150 rounded-xl text-red-400 hover:bg-red-400 hover:text-white"
                    >
                    <LogOut size={16}/>
                    Logout
                    </button>
              </div>
            </div>
          )}
        </div>
      </nav>
 
      
 
      
    </div>
    </>)
}

export default Header