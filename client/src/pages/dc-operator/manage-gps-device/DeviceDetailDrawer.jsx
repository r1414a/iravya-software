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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Truck,
    Pencil,
    Wifi,
    WifiOff,
    AlertTriangle,
    RefreshCw,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    Cpu,
    Zap,
    Signal,
} from "lucide-react"
import { useState } from "react"

// ── Status config ─────────────────────────────────────────────────────────────
const statusStyles = {
    online:     "bg-green-100 text-green-700",
    offline:    "bg-gray-100 text-gray-500",
    warning:    "bg-amber-100 text-amber-700",
    unassigned: "bg-purple-100 text-purple-700",
}
const statusLabels = {
    online: "Online", offline: "Offline", warning: "Warning", unassigned: "Unassigned",
}

// ── Signal bars (same as columns.jsx) ────────────────────────────────────────
function SignalBars({ strength }) {
    const color =
        strength > 60 ? "bg-green-500"
        : strength > 30 ? "bg-amber-500"
        : "bg-gray-300"
    return (
        <div className="flex items-end gap-0.5 h-4">
            {[25, 50, 75, 100].map((t, i) => (
                <div
                    key={i}
                    className={`w-1.5 rounded-sm ${strength >= t ? color : "bg-gray-200"}`}
                    style={{ height: `${(i + 1) * 5 + 4}px` }}
                />
            ))}
            <span className="ml-1.5 text-sm font-medium text-gray-700">
                {strength > 0 ? `${strength}%` : "No signal"}
            </span>
        </div>
    )
}

// ── Mock ping log ─────────────────────────────────────────────────────────────
const mockPingLog = [
    { time: "10:42:18 AM", lat: "18.5204", lng: "73.8567", signal: 87, ok: true },
    { time: "10:42:08 AM", lat: "18.5198", lng: "73.8561", signal: 85, ok: true },
    { time: "10:41:58 AM", lat: "18.5192", lng: "73.8554", signal: 88, ok: true },
    { time: "10:41:48 AM", lat: "18.5186", lng: "73.8548", signal: 82, ok: true },
    { time: "10:41:38 AM", lat: "—",       lng: "—",       signal: 0,  ok: false },
    { time: "10:41:28 AM", lat: "18.5174", lng: "73.8535", signal: 79, ok: true },
]

// ── Diagnostic row ────────────────────────────────────────────────────────────
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

// ── Main drawer ───────────────────────────────────────────────────────────────
export default function DeviceDetailDrawer({ device, open, onClose }) {
    const [editingTruck, setEditingTruck] = useState(false)

    if (!device) return null

    const isOnline = device.status === "online"
    const hasWarning = device.status === "warning"

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
                        <Badge className={`${statusStyles[device.status]} border-0 text-xs font-medium mt-1`}>
                            {statusLabels[device.status]}
                        </Badge>
                    </div>

                    {/* Quick stats row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                            { icon: Signal, label: "Signal",   content: <SignalBars strength={device.signalStrength} /> },
                            { icon: Zap,    label: "Battery",  content: <span className={`text-sm font-semibold ${device.battery <= 15 ? "text-red-600" : "text-gray-800"}`}>{device.battery}%</span> },
                            { icon: Cpu,    label: "Trips",    content: <span className="text-sm font-semibold text-gray-800">{device.totalTrips}</span> },
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
                                Weak signal detected. Battery critically low. Check device on truck.
                            </p>
                        </div>
                    )}
                </SheetHeader>

                {/* ── Device details ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Device info
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            ["SIM card", device.simNo],
                            ["Firmware", device.firmware],
                            ["Installed", device.installDate],
                            ["Trips this month", device.tripsThisMonth],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-sm font-medium text-gray-800 font-mono">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Truck assignment — same inline-edit pattern as driver section ── */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Assigned truck
                        </p>
                        <button
                            className="text-xs text-maroon flex items-center gap-1 hover:underline"
                            onClick={() => setEditingTruck(!editingTruck)}
                        >
                            <Pencil size={11} />
                            {editingTruck ? "Cancel" : "Reassign"}
                        </button>
                    </div>

                    {editingTruck ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs">Select truck</Label>
                                <Select defaultValue={device.assignedTruck ?? ""}>
                                    <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Select truck..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border shadow-md">
                                        <SelectGroup>
                                            <SelectLabel>Available trucks</SelectLabel>
                                            <SelectItem value="MH12AB1234">MH12AB1234</SelectItem>
                                            <SelectItem value="MH14CD5678">MH14CD5678</SelectItem>
                                            <SelectItem value="MH20GH7788">MH20GH7788</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button size="sm" className="bg-maroon hover:bg-maroon-dark text-white w-fit">
                                Save
                            </Button>
                        </div>
                    ) : device.assignedTruck ? (
                        <div className="flex items-center gap-2 text-sm">
                            <Truck size={14} className="text-gray-400" />
                            <span className="font-mono font-medium">{device.assignedTruck}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No truck assigned</p>
                    )}
                </div>

                {/* ── Diagnostics ── */}
                <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Diagnostics
                        </p>
                        <button className="text-xs text-maroon flex items-center gap-1 hover:underline">
                            <RefreshCw size={11} /> Re-ping
                        </button>
                    </div>
                    <div>
                        <DiagRow label="MQTT connection"  value={isOnline ? "Connected" : "Disconnected"}         ok={isOnline} />
                        <DiagRow label="GPS fix"          value={isOnline ? "3D fix — 8 satellites" : "No fix"}    ok={isOnline} />
                        <DiagRow label="Cellular network" value={device.signalStrength > 0 ? `HSPA+ (${device.signalStrength}%)` : "No signal"} ok={device.signalStrength > 30} />
                        <DiagRow label="Battery"          value={device.battery > 20 ? `${device.battery}% — OK` : `${device.battery}% — Low`} ok={device.battery > 20} />
                        <DiagRow label="Firmware"         value={device.firmware === "v2.4.1" ? `${device.firmware} — Latest` : `${device.firmware} — Update available`} ok={device.firmware === "v2.4.1"} />
                    </div>
                </div>

                {/* ── Last known location ── */}
                <div className="px-6 py-4 border-b">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Last known location
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span>{device.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-5">{device.lastPingDate}</p>
                </div>

                {/* ── Ping log ── */}
                <div className="px-6 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Recent pings
                    </p>
                    <div className="flex flex-col gap-0">
                        {mockPingLog.map((ping, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 py-2.5 border-b last:border-0"
                            >
                                <div className={`mt-0.5 rounded-full p-0.5 ${ping.ok ? "bg-green-100" : "bg-red-100"}`}>
                                    {ping.ok
                                        ? <CheckCircle2 size={12} className="text-green-600" />
                                        : <XCircle size={12} className="text-red-400" />
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