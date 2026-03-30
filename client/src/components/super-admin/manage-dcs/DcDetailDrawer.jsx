import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Truck,
    Users,
    LocateFixed,
    MapPin,
    Phone,
    Mail,
    Pencil,
    CheckCircle2,
    Clock,
    Road,
    Ban,
} from "lucide-react"
import { useState } from "react"

const statusStyles = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

// Recent trips for this DC — mock data
const mockTrips = [
    { id: "TRP-2841", truck: "MH12AB1234", driver: "Ravi D.", stops: "Koregaon → Baner", status: "in_transit",  time: "Today, 09:30 AM" },
    { id: "TRP-2840", truck: "MH14CD5678", driver: "Suresh P.", stops: "Hinjawadi",       status: "in_transit",  time: "Today, 08:15 AM" },
    { id: "TRP-2839", truck: "MH04EF9012", driver: "Anil B.",   stops: "FC Road → Kothrud",status: "completed",  time: "Yesterday" },
    { id: "TRP-2838", truck: "MH12GH3456", driver: "Manoj K.",  stops: "Wakad",           status: "completed",  time: "Yesterday" },
]

const tripStatusStyle = {
    in_transit: { bg: "bg-blue-100",  text: "text-blue-600",  label: "In transit" },
    completed:  { bg: "bg-green-100", text: "text-green-600", label: "Completed"  },
    scheduled:  { bg: "bg-gray-100",  text: "text-gray-500",  label: "Scheduled"  },
}

export default function DCDetailDrawer({ dc, open, onClose }) {
    const [editingContact, setEditingContact] = useState(false)

    if (!dc) return null

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="bg-white min-w-110 overflow-y-auto flex flex-col gap-0 p-0">

                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <SheetTitle className="text-xl font-bold">{dc.name}</SheetTitle>
                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPin size={12} /> {dc.city} · {dc.brand}
                            </p>
                        </div>
                        <Badge className={`${statusStyles[dc.status]} border-0 text-xs font-medium mt-4`}>
                            {dc.status.charAt(0).toUpperCase() + dc.status.slice(1)}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{dc.address}</p>
                </SheetHeader>

                {/* ── Fleet summary — same 2-col grid as TruckDetailDrawer info grid ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Fleet at this DC
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Truck,        label: "Trucks",            value: `${dc.activeTrucks} active / ${dc.totalTrucks} total` },
                            { icon: Users,        label: "Drivers",           value: `${dc.totalDrivers} registered` },
                            { icon: LocateFixed,  label: "GPS devices",       value: `${dc.devicesAvailable} available / ${dc.totalDevices} total` },
                            { icon: Road,         label: "Active trips",      value: dc.activeTrips },
                            { icon: CheckCircle2, label: "Total trips",       value: dc.totalTrips },
                            { icon: Clock,        label: "Operating since",   value: dc.createdAt },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                                    <Icon size={11} /> {label}
                                </div>
                                <p className="text-sm font-medium text-gray-800">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* ── Recent trips from this DC ── */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Recent trips
                    </p>
                    <div className="flex flex-col gap-3">
                        {mockTrips.map((trip) => {
                            const s = tripStatusStyle[trip.status]
                            return (
                                <div
                                    key={trip.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className={`mt-0.5 rounded-full p-1 ${s.bg}`}>
                                        {trip.status === "completed"
                                            ? <CheckCircle2 size={13} className={s.text} />
                                            : <Truck size={13} className={s.text} />
                                        }
                                    </div>
                                    <div className="flex-1 -space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-mono text-gray-500">{trip.id}</p>
                                            <Badge className={`${s.bg} ${s.text} border-0 text-[10px] font-medium`}>
                                                {s.label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium flex items-center gap-1">
                                            <Truck size={11} className="text-gray-400 shrink-0" />
                                            {trip.truck} · {trip.driver}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={10} /> {trip.stops}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={10} /> {trip.time}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}