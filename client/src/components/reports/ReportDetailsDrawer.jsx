import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
    Truck,
    MapPin,
    User,
    Clock,
    AlertTriangle,
    Building2,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { TRUCK_TYPES } from "@/constants/constant"

export default function ReportDetailsDrawer({ report, open, onClose }) {

    if (!report) return null

    const isDriver = report.is_complaintby_driver

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">

                {/* HEADER */}
                <SheetHeader className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-lg font-semibold">
                                Report Details
                            </SheetTitle>
                            <p className="text-xs text-gray-500 mt-6">
                                {report.trip_tracking_code}
                            </p>
                        </div>

                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                            {report.issue_type}
                        </Badge>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">

                    {/* ISSUE */}
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-1">
                            <AlertTriangle size={12} /> Issue
                        </p>
                        <p className="text-sm text-gray-700">
                            {report.complaint}
                        </p>
                    </div>

                    {/* TRUCK */}
                    <SectionCard icon={Truck} title="Truck">
                        <p className="font-medium">{report.truck_no}</p>
                        <p className="text-xs text-gray-500">
                            {report.truck_model} • {TRUCK_TYPES[report.truck_type]} • {`${report.capacity} Tons`}
                        </p>
                    </SectionCard>

                    {/* STORE */}
                    <SectionCard icon={MapPin} title="Store">
                        <p className="font-medium">{report.store_name}</p>
                        <p className="text-xs text-gray-500">{report.store_address}</p>

                        <div className="mt-2 text-xs">
                            <p className="flex items-center gap-1">
                                <User size={12} /> {report.store_manager}
                            </p>
                            <p className="text-gray-500">{report.store_manager_phone}</p>
                        </div>
                    </SectionCard>

                    {/* DC */}
                    <SectionCard icon={Building2} title="Distribution Center">
                        <p className="font-medium">{report.dc_name}</p>
                        <p className="text-xs text-gray-500">{report.dc_address}</p>

                        <p className="text-xs mt-2 flex items-center gap-1">
                            <User size={12} /> {report.dc_manager_name}
                        </p>
                    </SectionCard>

                    {/* TRIP */}
                    <SectionCard icon={Truck} title="Trip Info">
                        <div className="text-sm space-y-1">
                            <p>Distance: {report.distance} km</p>
                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                {report.departed_at
                                    ? format(parseISO(report.departed_at), "dd MMM yyyy, hh:mm a")
                                    : "-"}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                {report.end_time
                                    ? format(parseISO(report.end_time), "dd MMM yyyy, hh:mm a")
                                    : "-"}
                            </p>
                        </div>
                    </SectionCard>

                    {/* META */}
                    <SectionCard icon={User} title="Reported Info">
                        <p className="text-sm">
                            Reported by:{" "}
                            <span className="font-bold">
                                {isDriver ? "Driver" : "Store"}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {format(parseISO(report.created_at), "dd MMM yyyy, hh:mm a")}
                        </p>
                    </SectionCard>

                </div>
            </SheetContent>
        </Sheet>
    )
}


/* 🔹 Reusable Section Card */
function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="border rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition">
            <p className="text-xs font-semibold flex items-center gap-1 mb-2 uppercase tracking-wide">
                <Icon size={12} /> {title}
            </p>
            <div className="text-sm text-gray-700">
                {children}
            </div>
        </div>
    )
}