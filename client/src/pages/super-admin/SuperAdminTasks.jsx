import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SUPER_ADMIN_TASKS } from "@/constants/tasks";


import { Building2 ,
BookUser,
LocateFixed,
Truck,
Warehouse,
Store,
Road,
Siren,
ChartNoAxesCombined,
Settings
} from 'lucide-react';

import { useState } from "react";
import { Link } from "react-router-dom";


const ITEMS = [
  { key: "companies", label: "Brands", icon: <Building2 size={35} color="white"strokeWidth={1}/>, bg: "bg-pink-700 shadow-lg shadow-pink-500/40", path: "/admin/companies" },
  { key: "users", label: "Users", icon: <BookUser size={35} color="white"strokeWidth={1}/>, bg: "bg-sky-700 shadow-lg shadow-sky-700/40", path: "/admin/manage-user" },
  { key: "devices", label: "Register GPS Devices", icon: <LocateFixed size={35} color="white"strokeWidth={1}/>, bg: "bg-teal-700 shadow-lg shadow-teal-700/40", path: "/admin/manage-devices" },
  { key: "trucks", label: "Trucks", icon: <Truck size={35} color="white"strokeWidth={1}/>, bg: "bg-violet-600 shadow-lg shadow-violet-600/40", path: "/admin/trucks" },
  { key: "dcs", label: "Warehouses", icon: <Warehouse size={35} color="white"strokeWidth={1}/>, bg: "bg-amber-700 shadow-lg shadow-amber-700/40", path: "/admin/dcs" },
  { key: "stores", label: "Stores", icon: <Store size={35} color="white"strokeWidth={1}/>, bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40", path: "/admin/stores" },
  { key: "trips", label: "View Trips", icon: <Road size={35} color="white"strokeWidth={1}/>, bg: "bg-slate-800 shadow-lg shadow-slate-800/40", path: "/admin/trips" },
  { key: "alerts", label: "Alerts", icon: <Siren size={35} color="white"strokeWidth={1}/>, bg: "bg-red-800 shadow-lg shadow-red-800/40", path: "/admin/alerts" },
  { key: "analytics", label: "Analytics", icon: <ChartNoAxesCombined strokeWidth={1} size={35} color="white"/>, bg: "bg-yellow-700 shadow-lg shadow-yellow-700/40", path: "/admin/analytics" },
  { key: "settings", label: "Settings", icon: <Settings size={35} color="white" strokeWidth={1}/>,  bg: "bg-green-500 shadow-lg shadow-green-500/40", path: "/admin/settings" },
];


function MenuCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
 
  return (
    <Link to={item.path} key={item.label}>
    <button
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
    </button>
    </Link>
  );
}
export default function SuperAdminTasks(){
    return(
      <>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
        {ITEMS.map((item) => (
          <Card
            key={item.key}
            onClick={() => navigate(item.path)}
            className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="flex flex-col items-center justify-center py-2 gap-2">
              
             
              <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-100 text-4xl shadow-lg">
                {item.icon}
              </div>

           
              <p className="text-sm font-medium text-white text-center">
                {item.label}
              </p>

            </CardContent>
          </Card>
        ))}
      </div> */}
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-6">
      <div
          className="grid gap-5 w-full grid-cols-1 md:grid-cols-3 max-w-[600px]"
          // style={{
          //   maxWidth: "600px",
          //   gridTemplateColumns: "repeat(3, 1fr)",
          // }}
        >
          {/* Row 1: 3 cards */}
          {SUPER_ADMIN_TASKS.slice(0, 3).map((item, i) => (
            <MenuCard key={item.label} item={item} index={i} />
          ))}
 
          {/* Row 2: 2 cards centered */}
          <div className="col-span-3 grid gap-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
             {/* spacer to push cards to center visually */}
            {/* {ITEMS.slice(3).map((item, i) => (
              <MenuCard key={item.label} item={item} index={i + 3} />
            ))} */}
            {SUPER_ADMIN_TASKS.slice(3).map((item, i) => (
              
                <MenuCard item={item} index={i + 3} />
              
            ))}
            
          </div>
        </div>
    </main> 
    </>
    )
}