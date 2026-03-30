import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"
import {
    Truck, MapPin, Clock, CheckCheck,
    Zap, Navigation, Radio, BatteryLow,
    Building2, User, ChevronRight,
} from "lucide-react"
 
const TYPE_CONFIG = {
    speeding:        { label: "Speeding",        icon: Zap,        color: "text-red-500",    bg: "bg-red-50"    },
    long_stop:       { label: "Long stop",        icon: Clock,      color: "text-amber-600",  bg: "bg-amber-50"  },
    route_deviation: { label: "Route deviation",  icon: Navigation, color: "text-orange-500", bg: "bg-orange-50" },
    geofence_enter:  { label: "Geofence enter",   icon: MapPin,     color: "text-blue-500",   bg: "bg-blue-50"   },
    geofence_exit:   { label: "Geofence exit",    icon: MapPin,     color: "text-blue-400",   bg: "bg-blue-50"   },
    device_offline:  { label: "Device offline",   icon: Radio,      color: "text-gray-500",   bg: "bg-gray-50"   },
    device_low_batt: { label: "Low battery",      icon: BatteryLow, color: "text-yellow-600", bg: "bg-yellow-50" },
}
 
const SEVERITY_STYLES = {
    high:   "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low:    "bg-yellow-100 text-yellow-700",
    info:   "bg-blue-100 text-blue-600",
}
 
// Mock timeline — what happened before and after the alert
const mockTimeline = [
    { label: "Trip dispatched",  time: "Today, 08:45 AM", done: true  },
    { label: "Alert triggered",  time: "Today, 10:42 AM", done: true, isAlert: true },
    { label: "Alert acknowledged", time: "—",             done: false },
    { label: "Trip completed",   time: "—",               done: false },
]
 
export default function AlertDetailDrawer({ alert, open, onClose }) {
    if (!alert) return null
 
    const cfg  = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.speeding
    const Icon = cfg.icon
 
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="bg-white min-w-110 overflow-y-auto flex flex-col gap-0 p-0">
 
                {/* ── Header — same pattern as DCDetailDrawer ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <Icon size={18} className={cfg.color} />
                            </div>
                            <div>
                                <SheetTitle className={`text-lg font-bold ${cfg.color}`}>
                                    {cfg.label}
                                </SheetTitle>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{alert.id}</p>
                            </div>
                        </div>
                        <div className="flex mt-4 items-end gap-2">
                            <Badge className={`${SEVERITY_STYLES[alert.severity]} border-0 text-xs font-medium capitalize`}>
                                {alert.severity}
                            </Badge>
                            {!alert.isRead && (
                                <span className="text-[10px] bg-maroon text-white px-1.5 py-0.5 rounded-full font-medium">
                                    Unread
                                </span>
                            )}
                        </div>
                    </div>
 
                    {/* Description */}
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">{alert.description}</p>
 
                    {/* Quick action */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 w-fit flex items-center gap-2 text-maroon border-maroon/30 hover:bg-maroon/5"
                    >
                        <CheckCheck size={14} />
                        {alert.isRead ? "Mark as unread" : "Mark as read"}
                    </Button>
                </SheetHeader>
 
                {/* ── Details grid — same 2-col bg-gray-50 border-gray-100 rounded-lg style ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Alert details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Building2, label: "Brand",   value: alert.brand   },
                            { icon: Truck,     label: "Truck",   value: alert.truck   },
                            { icon: User,      label: "Driver",  value: alert.driver  },
                            { icon: Truck,     label: "Trip ID", value: alert.tripId  },
                            { icon: Building2, label: "DC",      value: alert.dc      },
                            { icon: Clock,     label: "Time",    value: alert.time    },
                        ].map(({ icon: RowIcon, label, value }) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                    <RowIcon size={11} /> {label}
                                </div>
                                <p className="text-sm font-medium text-gray-800">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* ── Location ── */}
                {/* <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Location when triggered
                    </p>
                    <div className="flex items-start gap-2 text-sm">
                        <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{alert.location}</span>
                    </div>
                    <div className="w-full h-36 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center mt-3">
                        <div className="text-center">
                            <MapPin size={18} className="text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Map renders here (Leaflet)</p>
                        </div>
                    </div>
                </div> */}
 
                {/* ── Trip timeline — same CheckCircle2 / circle pattern as TripDetailSheet ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Trip timeline
                    </p>
                    <div className="flex flex-col gap-0">
                        {mockTimeline.map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 border-2 ${
                                        step.isAlert
                                            ? "border-red-500 bg-red-500"
                                            : step.done
                                            ? "border-green-500 bg-green-500"
                                            : "border-gray-300 bg-white"
                                    }`} />
                                    {i < mockTimeline.length - 1 && (
                                        <div className="w-px flex-1 bg-gray-200 my-1" />
                                    )}
                                </div>
                                <div className="pb-4">
                                    <p className={`text-sm font-medium ${step.isAlert ? "text-red-600" : step.done ? "text-gray-800" : "text-gray-400"}`}>
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* ── View full trip button ── */}
                {/* <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Related trip
                    </p>
                    <div
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="-space-y-0.5">
                            <p className="text-sm font-mono font-semibold text-maroon">{alert.tripId}</p>
                            <p className="text-xs text-gray-400">{alert.truck} · {alert.driver}</p>
                            <p className="text-xs text-gray-400">from {alert.dc}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </div> */}
 
                {/* ── Danger zone — dismiss ── */}
                {/* <div className="px-6 py-4 border-t">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Actions
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-2"
                    >
                        Dismiss alert
                    </Button>
                </div> */}
 
            </SheetContent>
        </Sheet>
    )
}
 