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
    MapPin,
    Phone,
    Mail,
    Pencil,
    CheckCircle2,
    Clock,
    Truck,
    LocateFixed,
    ExternalLink,
    Copy,
    Ban,
    ShieldCheck,
} from "lucide-react"
import { useState } from "react"

const statusStyles = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
}

// Mock recent deliveries for this store
const mockDeliveries = [
    { id: "TRP-2841", truck: "MH12AB1234", driver: "Ravi D.",   from: "Pune Warehouse DC", arrivedAt: "Today, 10:45 AM",      status: "confirmed" },
    { id: "TRP-2830", truck: "MH14CD5678", driver: "Suresh P.", from: "Pune Warehouse DC", arrivedAt: "Yesterday, 03:20 PM",  status: "confirmed" },
    { id: "TRP-2819", truck: "MH04EF9012", driver: "Anil B.",   from: "Nashik DC",         arrivedAt: "Mar 23, 11:00 AM",     status: "confirmed" },
    { id: "TRP-2801", truck: "MH20IJ7890", driver: "Manoj K.",  from: "Pune Warehouse DC", arrivedAt: "Mar 22, 09:30 AM",     status: "confirmed" },
]

export default function StoreDetailDrawer({ store, open, onClose }) {
    const [editingManager, setEditingManager] = useState(false)
    const [copied, setCopied]                 = useState(false)

    if (!store) return null

    const publicUrl = `/track/${store.publicTrackingSlug}`

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="bg-white min-w-110 overflow-y-auto flex flex-col gap-0 p-0">

                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <SheetTitle className="text-xl font-bold">{store.name}</SheetTitle>
                            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                <MapPin size={12} /> {store.city} · {store.brand}
                            </p>
                        </div>
                        <Badge className={`${statusStyles[store.status]} border-0 text-xs font-medium mt-6`}>
                            {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{store.address}</p>
                </SheetHeader>

                {/* ── Stats grid — same 2-col pattern as DCDetailDrawer ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Store overview
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            // { icon: Truck,        label: "Deliveries today",   value: store.deliveriesToday > 0 ? `${store.deliveriesToday} incoming` : "None today" },
                            // { icon: CheckCircle2, label: "Total deliveries",   value: store.totalDeliveries },
                            // { icon: LocateFixed,  label: "Devices held",       value: store.currentDevices.length > 0 ? `${store.currentDevices.length} device(s)` : "None" },
                            { icon: ShieldCheck,  label: "Geofence radius",    value: `${store.geofenceRadius}m` },
                            // { icon: Clock,        label: "Last delivery",      value: store.lastDelivery },
                            { icon: Clock,        label: "Active since",       value: store.createdAt },
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

                {/* ── Public tracking URL ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Public tracking URL
                    </p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-sm font-mono text-blue-600 flex-1">{publicUrl}</span>
                        <button
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                            title="Copy URL"
                        >
                            <Copy size={14} />
                        </button>
                        <button
                            onClick={() => window.open(publicUrl, "_blank")}
                            className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                            title="Open in new tab"
                        >
                            <ExternalLink size={14} />
                        </button>
                    </div>
                    {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard</p>}
                    <p className="text-xs text-gray-400 mt-2">
                        Share this link with the store. Anyone with this URL can track incoming deliveries — no login required.
                    </p>
                </div>


                {/* ── Recent deliveries — same trip list pattern as DCDetailDrawer ── */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Recent deliveries
                    </p>
                    <div className="flex flex-col gap-3">
                        {mockDeliveries.map((delivery) => (
                            <div
                                key={delivery.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="mt-0.5 rounded-full p-1 bg-green-100">
                                    <CheckCircle2 size={13} className="text-green-600" />
                                </div>
                                <div className="flex-1 -space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-mono text-gray-500">{delivery.id}</p>
                                        <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">
                                            Confirmed
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        <Truck size={11} className="text-gray-400 shrink-0" />
                                        {delivery.truck} · {delivery.driver}
                                    </p>
                                    <p className="text-xs text-gray-400">From {delivery.from}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {delivery.arrivedAt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </SheetContent>
        </Sheet>
    )
}