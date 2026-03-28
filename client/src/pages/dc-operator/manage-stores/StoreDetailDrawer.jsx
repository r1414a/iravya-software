import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, MapPin, Phone, Mail, Hash } from "lucide-react"

const statusStyles = {
    active:   "bg-green-100 text-green-700",
    inactive: "bg-red-100 text-red-700",
    pending:  "bg-amber-100 text-amber-700",
}
const statusLabels = {
    active: "Active", inactive: "Inactive", pending: "Pending",
}

function DetailRow({ label, value, mono = false }) {
    return (
        <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <span className={`text-sm font-semibold text-right max-w-[60%] ${mono ? "font-mono" : ""}`}>
                {value || "—"}
            </span>
        </div>
    )
}

export default function StoreDetailDrawer({ store, open, onClose, onEdit }) {
    if (!store) return null

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[420px] p-0 flex flex-col right-0">
                {/* Coloured header */}
                <div className=" text-white px-5 py-3 borde border-b-gray-700">
                    <SheetHeader>
                        <SheetTitle className="text-gray-700 text-lg font-bold leading-snug">
                            {store.name}
                        </SheetTitle>
                    </SheetHeader>
                    <p className="text-gray-500 text-xs font-mono mt-1">{store.id}</p>
                    <Badge className={`mt-3 ${statusStyles[store.status]} border-0 text-xs font-semibold`}>
                        {statusLabels[store.status]}
                    </Badge>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                    {/* Location */}
                    <section>
                        <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                            <MapPin size={12} /> Location
                        </h3>
                        <DetailRow label="Address"  value={store.address} />
                        <DetailRow label="City"     value={store.city} />
                        <DetailRow label="State"    value={store.state} />
                        <DetailRow label="Pincode"  value={store.pin} mono />
                    </section>

                    {/* Contact */}
                    <section>
                        <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                            <Phone size={12} /> Contact Details
                        </h3>
                        <DetailRow label="Manager" value={store.manager} />
                        <DetailRow label="Phone"   value={store.phone} mono />
                        <DetailRow label="Email"   value={store.email} />
                    </section>
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t flex gap-3">
                    <Button
                        className="flex-1 bg-maroon text-white hover:bg-maroon-dark flex items-center gap-2"
                        onClick={() => { onClose(); onEdit(store); }}
                    >
                        <Pencil size={14} /> Edit Store
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}