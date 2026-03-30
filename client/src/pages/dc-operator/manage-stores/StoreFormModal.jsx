import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store } from "lucide-react"
import { useEffect, useState } from "react"

const EMPTY = {
    name: "", address: "", city: "", state: "", country: "",
    pin: "", status: "active", manager: "", phone: "", email: "",
}

export default function StoreFormModal({ open, onClose, store, onSave }) {
    const [form, setForm] = useState(EMPTY)
    const isEdit = !!store?.id

    useEffect(() => {
        setForm(store ? { ...store } : EMPTY)
    }, [store, open])

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    function handleSave() {
        if (!form.name.trim()) return
        onSave(form)
        onClose()
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-[460px] sm:max-w-[460px] p-0 flex flex-col bg-white"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                    <SheetTitle className="text-lg font-bold">
                        {isEdit ? "Edit Store" : "Add new store"}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-400">
                        {isEdit
                            ? "Update store details and location."
                            : "Add store details with location."}
                    </SheetDescription>
                </SheetHeader>

                {/* Scrollable form body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Store Name */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Store Name
                        </Label>
                        <Input
                            placeholder="Name"
                            value={form.name}
                            onChange={set("name")}
                            className="h-10"
                        />
                    </div>

                    {/* Address — textarea like in image */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Address
                        </Label>
                        <Textarea
                            placeholder="Add address"
                            value={form.address}
                            onChange={set("address")}
                            className="resize-none min-h-[80px]"
                        />
                    </div>

                    {/* City / State / Country — 3 columns like image */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">City</Label>
                            <Input
                                placeholder="Add city"
                                value={form.city}
                                onChange={set("city")}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">State</Label>
                            <Input
                                placeholder="Add state"
                                value={form.state}
                                onChange={set("state")}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Country</Label>
                            <Input
                                placeholder="Add country"
                                value={form.country}
                                onChange={set("country")}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={set("email")}
                            className="h-10"
                        />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Contact Number
                        </Label>
                        <Input
                            placeholder="+91 XXXXX XXXXX"
                            value={form.phone}
                            onChange={set("phone")}
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">
                            Status
                        </Label>
                        <Select
                            value={form.status || ""}
                            onValueChange={set("status")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>

                        </Select>
                    </div>
                </div>

                {/* Footer — sticky at bottom like image */}
                <div className="px-6 py-4 border-t flex items-center gap-3">
                    <Button
                        className="flex-1 bg-maroon text-white hover:bg-maroon-dark h-11 text-sm font-semibold flex items-center gap-2"
                        onClick={handleSave}
                    >

                        {isEdit ? "Save changes" : "Add store"}
                        <Store size={16} />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 h-11 text-sm font-semibold"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}