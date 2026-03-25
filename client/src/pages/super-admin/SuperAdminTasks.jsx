import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ITEMS = [
  { key: "companies", label: "Manage Brands", icon: "🏢", path: "/admin/companies" },
  { key: "users", label: "Manage Users", icon: "👤", path: "/admin/users" },
  { key: "devices", label: "Register GPS Devices", icon: "📡", path: "/admin/devices" },
  { key: "trucks", label: "Manage Trucks", icon: "🚚", path: "/admin/trucks" },
  { key: "dcs", label: "Manage Warehouses", icon: "🏬", path: "/admin/dcs" },
  { key: "stores", label: "Manage Stores", icon: "🏪", path: "/admin/stores" },
  { key: "trips", label: "View Trips", icon: "🗺️", path: "/admin/trips" },
  { key: "alerts", label: "Alerts", icon: "🚨", path: "/admin/alerts" },
  { key: "analytics", label: "Analytics", icon: "📊", path: "/admin/analytics" },
  { key: "settings", label: "Settings", icon: "⚙️", path: "/admin/settings" },
];

export default function SuperAdminTasks(){
    return(
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {ITEMS.map((item) => (
          <Card
            key={item.key}
            onClick={() => navigate(item.path)}
            className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
              
              {/* Icon */}
              <div className="w-32 h-32 flex items-center justify-center rounded-xl bg-gray-100 text-4xl shadow-lg">
                {item.icon}
              </div>

              {/* Label */}
              <p className="text-lg font-medium text-white text-center">
                {item.label}
              </p>

            </CardContent>
          </Card>
        ))}
      </div>
    )
}