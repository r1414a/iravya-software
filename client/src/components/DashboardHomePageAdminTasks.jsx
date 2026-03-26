import { useState } from "react";
import { Link } from "react-router-dom";


function MenuCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <Link
        to={item.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border-0 outline-none cursor-pointer transition-all duration-200 h-38"
      style={{
        background: hovered ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.93)",
        boxShadow: hovered
          ? "0 20px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)"
          : "0 4px 24px rgba(0,0,0,0.10)",
        transform: hovered ? "translateY(-4px) scale(1.03)" : "translateY(0) scale(1)",
        minWidth: 0,
        width: "100%",
       
        animationDelay: `${index * 80}ms`,
        animation: "fadeUp 0.45s ease both",
      }}
    >
      {/* Icon tile */}
      <div
        className={`w-17 h-17 rounded-2xl ${item.bg} flex items-center justify-center transition-transform duration-200`}
        style={{
          background: item.gradient,
          boxShadow: `0 8px 24px ${item.shadow}`,
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        {item.icon}
      </div>
 
      {/* Label */}
      <span
        className="text-base text-xs font-semibold  text-gray-600"
        
      >
        {item.label}
      </span>
    </Link>
  );
}
export default function DashboardHomePageAdminTask({tasks}){
    return(
    <main className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
      <div
          className="grid gap-5 w-full grid-cols-1 md:grid-cols-3 max-w-[600px]"
          // style={{
          //   maxWidth: "600px",
          //   gridTemplateColumns: "repeat(3, 1fr)",
          // }}
        >
          {/* Row 1: 3 cards */}
          {tasks.slice(0, 3).map((item, i) => (
            <MenuCard key={item.label} item={item} index={i} />
          ))}
 
          {/* Row 2: 2 cards centered */}
          <div className="col-span-3 grid gap-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
             {/* spacer to push cards to center visually */}
            {tasks.slice(3).map((item, i) => (
              <MenuCard key={item.label} item={item} index={i + 3} />
            ))}
            
          </div>
        </div>
    </main> 
    )
}