import {
    Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"
import {
    Truck, AlertTriangle, RefreshCw, MapPin,
    Clock, CheckCircle2, XCircle, Cpu, Zap, Signal,
    Store, Warehouse, ChevronRight,
} from "lucide-react"
 
// ── Updated status config ─────────────────────────────────────────────────────
const statusStyles = {
    available:  "bg-green-100 text-green-700",
    in_transit: "bg-blue-100 text-blue-700",
    at_store:   "bg-amber-100 text-amber-700",
    offline:    "bg-gray-100 text-gray-500",
}
const statusLabels = {
    available:  "Available",
    in_transit: "In transit",
    at_store:   "At store",
    offline:    "Offline",
}
 
// ── Device location tracker — shows current stage in lifecycle ────────────────
// function DeviceLocationTracker({ status }) {
//     const stages = [
//         { key: "available",  label: "DC shelf",  icon: Warehouse },
//         { key: "in_transit", label: "In truck",  icon: Truck     },
//         { key: "at_store",   label: "At store",  icon: Store     },
//     ]
//     const currentIdx = stages.findIndex(s => s.key === status)
 
//     return (
//         <div className="flex items-center gap-0 mt-1">
//             {stages.map((stage, i) => {
//                 const Icon     = stage.icon
//                 const isActive = stage.key === status
//                 const isPast   = i < currentIdx
//                 return (
//                     <div key={stage.key} className="flex items-center">
//                         <div className={`flex flex-col items-center gap-1`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                                 isActive
//                                     ? "border-maroon bg-maroon text-white"
//                                     : isPast
//                                     ? "border-green-500 bg-green-50 text-green-600"
//                                     : "border-gray-200 bg-gray-50 text-gray-300"
//                             }`}>
//                                 <Icon size={14} />
//                             </div>
//                             <p className={`text-[10px] font-medium ${isActive ? "text-maroon" : isPast ? "text-green-600" : "text-gray-400"}`}>
//                                 {stage.label}
//                             </p>
//                         </div>
//                         {i < stages.length - 1 && (
//                             <div className={`w-10 h-0.5 mb-4 ${isPast || isActive ? "bg-maroon" : "bg-gray-200"}`} />
//                         )}
//                     </div>
//                 )
//             })}
//         </div>
//     )
// }
 
function SignalBars({ strength }) {
    const color = strength > 60 ? "bg-green-500" : strength > 30 ? "bg-amber-500" : "bg-gray-300"
    return (
        <div className="flex items-end gap-0.5 h-4">
            {[25, 50, 75, 100].map((t, i) => (
                <div key={i} className={`w-1.5 rounded-sm ${strength >= t ? color : "bg-gray-200"}`}
                    style={{ height: `${(i + 1) * 5 + 4}px` }} />
            ))}
            <span className="ml-1.5 text-sm font-medium text-gray-700">
                {strength > 0 ? `${strength}%` : "No signal"}
            </span>
        </div>
    )
}
 
function DiagRow({ label, value, ok }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b last:border-0">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-red-400"}`} />
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className={`text-xs font-mono ${ok ? "text-gray-700" : "text-red-500"}`}>{value}</span>
        </div>
    )
}
 
const mockPingLog = [
    { time: "10:42:18 AM", lat: "18.5204", lng: "73.8567", signal: 87, ok: true  },
    { time: "10:42:08 AM", lat: "18.5198", lng: "73.8561", signal: 85, ok: true  },
    { time: "10:41:58 AM", lat: "18.5192", lng: "73.8554", signal: 88, ok: true  },
    { time: "10:41:48 AM", lat: "18.5186", lng: "73.8548", signal: 82, ok: true  },
    { time: "10:41:38 AM", lat: "—",       lng: "—",       signal: 0,  ok: false },
    { time: "10:41:28 AM", lat: "18.5174", lng: "73.8535", signal: 79, ok: true  },
]
 
export default function DeviceDetailDrawer({ device, open, onClose }) {
    if (!device) return null
 
    const isOnline   = device.status === "in_transit"
    const hasWarning = device.battery <= 15 || device.signalStrength < 30
 
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="bg-white min-w-110 overflow-y-auto flex flex-col gap-0 p-0">
 
                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <SheetTitle className="text-xl font-mono font-bold">
                                {device.deviceId}
                            </SheetTitle>
                            <p className="text-sm text-gray-500 mt-0.5 font-mono">
                                IMEI: {device.imei}
                            </p>
                        </div>
                        <Badge className={`${statusStyles[device.status]} border-0 text-xs font-medium mt-4`}>
                            {statusLabels[device.status]}
                        </Badge>
                    </div>
 
                    {/* Device lifecycle tracker */}
                    {/* <div className="mt-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Current location</p>
                        <DeviceLocationTracker status={device.status} />
                    </div> */}
 
                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                            { icon: Signal, label: "Signal",  content: <SignalBars strength={device.signalStrength} /> },
                            { icon: Zap,    label: "Battery", content: <span className={`text-sm font-semibold ${device.battery <= 15 ? "text-red-600" : "text-gray-800"}`}>{device.battery}%</span> },
                            { icon: Cpu,    label: "Trips",   content: <span className="text-sm font-semibold text-gray-800">{device.totalTrips}</span> },
                        ].map(({ icon: Icon, label, content }) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                                    <Icon size={11} /> {label}
                                </div>
                                {content}
                            </div>
                        ))}
                    </div>
 
                    {/* Warning banner */}
                    {hasWarning && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
                            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-700">
                                {device.battery <= 15 ? "Battery critically low." : ""}
                                {device.signalStrength < 30 ? " Weak signal detected." : ""} Check device.
                            </p>
                        </div>
                    )}
                </SheetHeader>
 
                {/* ── Current assignment — replaces old "Assigned truck" section ── */}
                {/* <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Current assignment
                    </p>
 
                    {device.status === "in_transit" && (
                        <div className="flex flex-col gap-2">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck size={13} className="text-blue-500" />
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">On trip</p>
                                </div>
                                {[
                                    ["Trip ID",  device.currentTripId    ],
                                    ["Truck",    device.currentTruckReg  ],
                                    ["Driver",   device.currentDriverName],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-blue-100 last:border-0">
                                        <span className="text-xs text-blue-500">{label}</span>
                                        <span className="text-xs font-mono font-medium text-blue-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">
                                Device will be handed to the store on delivery. DC will collect it after.
                            </p>
                        </div>
                    )}
 
                    {device.status === "at_store" && (
                        <div className="flex flex-col gap-2">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Store size={13} className="text-amber-600" />
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">At store — awaiting pickup</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-amber-600">Store</span>
                                    <span className="text-xs font-medium text-amber-800">{device.currentStoreName}</span>
                                </div>
                            </div>
                            <Button size="sm" className="bg-maroon hover:bg-maroon-dark text-white w-fit text-xs">
                                Mark as returned to DC
                            </Button>
                        </div>
                    )}
 
                    {device.status === "available" && (
                        <div className="flex items-center gap-2 text-sm">
                            <Warehouse size={14} className="text-green-600" />
                            <span className="text-green-700 font-medium">On DC shelf — ready to dispatch</span>
                        </div>
                    )}
 
                    {device.status === "offline" && (
                        <p className="text-sm text-gray-400 italic">Not currently on a trip</p>
                    )}
                </div> */}
 
                {/* ── Device info grid ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Device info
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            ["SIM card",        device.simNo          ],
                            ["Firmware",        device.firmware       ],
                            ["Home DC",         device.homeDC         ],
                            ["Installed",       device.installDate    ],
                            ["Trips this month",device.tripsThisMonth ],
                            ["Total trips",     device.totalTrips     ],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-gray-800 font-mono">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* ── Diagnostics ── */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diagnostics</p>
                        <button className="text-xs text-maroon flex items-center gap-1 hover:underline">
                            <RefreshCw size={11} /> Re-ping
                        </button>
                    </div>
                    <DiagRow label="MQTT connection"   value={isOnline ? "Connected" : "Disconnected"}                                          ok={isOnline}                     />
                    <DiagRow label="GPS fix"            value={isOnline ? "3D fix — 8 satellites" : "No fix"}                                    ok={isOnline}                     />
                    <DiagRow label="Cellular network"   value={device.signalStrength > 0 ? `HSPA+ (${device.signalStrength}%)` : "No signal"}    ok={device.signalStrength > 30}   />
                    <DiagRow label="Battery"            value={device.battery > 20 ? `${device.battery}% — OK` : `${device.battery}% — Low`}     ok={device.battery > 20}          />
                    <DiagRow label="Firmware"           value={device.firmware === "v2.4.1" ? `${device.firmware} — Latest` : `${device.firmware} — Update available`} ok={device.firmware === "v2.4.1"} />
                </div>
 
                {/* ── Last known location ── */}
                {/* <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Last known location
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span>{device.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-5">{device.lastPingDate}</p>
                </div> */}
 
                {/* ── Recent pings ── */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent pings</p>
                    <div className="flex flex-col gap-0">
                        {mockPingLog.map((ping, i) => (
                            <div key={i} className="flex items-start gap-3 py-2.5 border-b last:border-0">
                                <div className={`mt-0.5 rounded-full p-0.5 ${ping.ok ? "bg-green-100" : "bg-red-100"}`}>
                                    {ping.ok
                                        ? <CheckCircle2 size={12} className="text-green-600" />
                                        : <XCircle     size={12} className="text-red-400"   />
                                    }
                                </div>
                                <div className="flex-1 -space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-gray-700">
                                            {ping.ok ? "Ping received" : "Ping missed"}
                                        </p>
                                        <p className="text-xs text-gray-400 font-mono">{ping.time}</p>
                                    </div>
                                    {ping.ok && (
                                        <p className="text-xs text-gray-400 font-mono">
                                            {ping.lat}, {ping.lng} · {ping.signal}% signal
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
 
            </SheetContent>
        </Sheet>
    )
}