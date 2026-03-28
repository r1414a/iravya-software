// ─── TruckDetailDrawer.jsx ────────────────────────────────────────────────────
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
    UserRound,
    Phone,
    Pencil,
    SendHorizonal,
    MapPin,
    Clock,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Wind,
    ExternalLink,
    AlertTriangle,
    Upload,
    X,
} from "lucide-react"
import { useState, useRef } from "react"

// ── Status config ─────────────────────────────────────────────────────────────
const statusStyles = {
    idle:        "bg-green-100 text-green-700",
    in_transit:  "bg-blue-100 text-blue-700",
    maintenance: "bg-amber-100 text-amber-700",
}
const statusLabels = {
    idle: "Idle", in_transit: "In transit", maintenance: "Maintenance",
}

// ── Mock trip history ─────────────────────────────────────────────────────────
const mockTripHistory = [
    { id: "TRP-0091", stores: "Koregaon Park → Hinjawadi", date: "Today, 09:14 AM", duration: "In progress", status: "in_transit" },
    { id: "TRP-0088", stores: "FC Road → Kothrud → Baner", date: "Mar 24, 10:00 AM", duration: "3h 12m", status: "completed" },
    { id: "TRP-0081", stores: "Viman Nagar", date: "Mar 22, 08:45 AM", duration: "1h 05m", status: "completed" },
    { id: "TRP-0074", stores: "Wakad → Pimple Saudagar", date: "Mar 20, 02:00 PM", duration: "2h 40m", status: "completed" },
]

// ── Mock documents (simulate uploaded files) ──────────────────────────────────
// In a real app these would come from the truck object / API
const mockDocs = {
    rc:        { name: "RC_MH12AB1234.pdf", size: "318 KB", expiry: null,         status: "valid" },
    insurance: { name: "Insurance_2024.pdf", size: "512 KB", expiry: "Dec 2025",  status: "expiring" },
    puc:       { name: "PUC_Mar2025.pdf",    size: "128 KB", expiry: "Sep 2026",  status: "valid" },
}

// ── Document status config ────────────────────────────────────────────────────
// const docStatusConfig = {
//     valid:    { color: "text-green-600",  bg: "bg-green-50  border-green-200",  label: "Valid" },
//     expiring: { color: "text-amber-600",  bg: "bg-amber-50  border-amber-200",  label: "Expiring soon" },
//     expired:  { color: "text-red-600",    bg: "bg-red-50    border-red-200",    label: "Expired" },
//     missing:  { color: "text-gray-400",   bg: "bg-gray-50   border-dashed border-gray-200", label: "Not uploaded" },
// }

// ── Document icons ────────────────────────────────────────────────────────────
// const docIcons = {
//     rc:        <FileText   size={15} />,
//     insurance: <ShieldCheck size={15} />,
//     puc:       <Wind       size={15} />,
// }

// const docLabels = {
//     rc:        "RC",
//     insurance: "Insurance",
//     puc:       "PUC",
// }

// ── Single document row ───────────────────────────────────────────────────────
// function DocRow({ docKey, doc }) {
//     const inputRef = useRef(null)
//     const [replaced, setReplaced] = useState(null) // locally replaced file (not persisted)

//     const cfg = docStatusConfig[doc?.status ?? "missing"]
//     const displayName = replaced?.name ?? doc?.name
//     const displaySize = replaced ? `${(replaced.size / 1024).toFixed(0)} KB` : doc?.size

//     return (
//         <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${cfg.bg} transition-colors`}>
//             {/* Icon */}
//             <span className={`shrink-0 ${cfg.color}`}>
//                 {docIcons[docKey]}
//             </span>

//             {/* Info */}
//             <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-1.5">
//                     <p className="text-sm font-medium text-gray-800">{docLabels[docKey]}</p>
//                     {doc?.expiry && (
//                         <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
//                             doc.status === "expiring" ? "bg-amber-100 text-amber-700"
//                             : doc.status === "expired" ? "bg-red-100 text-red-600"
//                             : "bg-green-100 text-green-700"
//                         }`}>
//                             {doc.status === "expiring" ? "⚠ " : ""} Exp {doc.expiry}
//                         </span>
//                     )}
//                 </div>
//                 {displayName
//                     ? <p className="text-xs text-gray-500 truncate">{displayName} · {displaySize}</p>
//                     : <p className="text-xs text-gray-400 italic">No file uploaded</p>
//                 }
//             </div>

//             {/* Actions */}
//             <div className="flex items-center gap-1 shrink-0">
//                 {/* View / open */}
//                 {displayName && (
//                     <button
//                         className="p-1.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-colors"
//                         title="View document"
//                     >
//                         <ExternalLink size={13} />
//                     </button>
//                 )}

//                 {/* Replace / upload */}
//                 <input
//                     ref={inputRef}
//                     type="file"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     className="hidden"
//                     onChange={(e) => setReplaced(e.target.files?.[0] ?? null)}
//                 />
//                 <button
//                     onClick={() => inputRef.current?.click()}
//                     className="p-1.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-colors"
//                     title={displayName ? "Replace" : "Upload"}
//                 >
//                     <Upload size={13} />
//                 </button>
//             </div>
//         </div>
//     )
// }

// ── Main drawer ───────────────────────────────────────────────────────────────
export default function TruckDetailDrawer({ truck, open, onClose }) {
    const [editingDriver, setEditingDriver] = useState(false)

    if (!truck) return null

    // In real app, docs would come from truck object. Using mock here.
    const docs = truck.docs ?? mockDocs

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="bg-white min-w-110 overflow-y-auto flex flex-col gap-0 p-0">

                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <SheetTitle className="text-xl font-mono font-bold">
                                {truck.regNo}
                            </SheetTitle>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {truck.make} · {truck.capacity}
                            </p>
                        </div>
                        <Badge className={`${statusStyles[truck.status]} border-0 text-xs font-medium mt-1`}>
                            {statusLabels[truck.status]}
                        </Badge>
                    </div>

                    {/* {truck.status === "idle" && (
                        <Button className="bg-maroon hover:bg-maroon-dark text-white w-full mt-3 flex items-center gap-2">
                            <SendHorizonal size={15} />
                            Dispatch this truck
                        </Button>
                    )} */}
                </SheetHeader>

                {/* ── GPS device ── */}
                {/* <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">GPS Device</p>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-mono">{truck.deviceId ?? "—"}</p>
                        <p className={`text-xs font-medium ${truck.deviceStatus === "online" ? "text-green-600" : "text-gray-400"}`}>
                            {truck.deviceStatus === "online" ? "● Online" : "○ Offline"}
                        </p>
                    </div>
                </div> */}

                {/* ── Driver info ── */}
                {/* <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver</p>
                        <button
                            className="text-xs text-maroon flex items-center gap-1 hover:underline"
                            onClick={() => setEditingDriver(!editingDriver)}
                        >
                            <Pencil size={11} />
                            {editingDriver ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    {editingDriver ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs">Full name</Label>
                                <Input defaultValue={truck.driverName ?? ""} placeholder="Driver name" className="h-8 text-sm" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs">Phone</Label>
                                <Input defaultValue={truck.driverPhone ?? ""} placeholder="+91 XXXXX XXXXX" className="h-8 text-sm" />
                            </div>
                            <Button size="sm" className="bg-maroon hover:bg-maroon-dark text-white w-fit">Save</Button>
                        </div>
                    ) : truck.driverName ? (
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-sm">
                                <UserRound size={14} className="text-gray-400" />
                                <span>{truck.driverName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-gray-600">{truck.driverPhone}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No driver assigned</p>
                    )}
                </div> */}

                {/* ── Documents ── */}
                {/* <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Documents</p>

                        {Object.values(docs).some((d) => !d || ["expiring", "expired", "missing"].includes(d?.status)) && (
                            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                <AlertTriangle size={11} />
                                Action needed
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        {["rc", "insurance", "puc"].map((key) => (
                            <DocRow key={key} docKey={key} doc={docs[key] ?? null} />
                        ))}
                    </div>
                </div> */}

                {/* ── Trip history ── */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Trip history
                    </p>

                    <div className="flex flex-col gap-3">
                        {mockTripHistory.map((trip) => (
                            <div
                                key={trip.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className={`mt-0.5 rounded-full p-1 ${trip.status === "in_transit" ? "bg-blue-100" : "bg-green-100"}`}>
                                    {trip.status === "in_transit"
                                        ? <Truck size={13} className="text-blue-600" />
                                        : <CheckCircle2 size={13} className="text-green-600" />
                                    }
                                </div>
                                <div className="flex-1 -space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-mono text-gray-500">{trip.id}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock size={10} />
                                            {trip.duration}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium flex items-center gap-1">
                                        <MapPin size={11} className="text-gray-400 shrink-0" />
                                        {trip.stores}
                                    </p>
                                    <p className="text-xs text-gray-400">{trip.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}