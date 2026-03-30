import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
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
    UserRound,
    KeyRound,
    Ban,
    CheckCircle2,
    Clock,
    Pencil,
} from "lucide-react"
import { useState } from "react"

// ── Role colour map — same as your columns.jsx ────────────────────────────────
const ROLE_COLOR = {
    "Brand manager": "bg-teal-100 border-teal-200 text-teal-700",
    "DC operator":   "bg-orange-100 border-orange-200 text-orange-700",
    "Store manager": "bg-yellow-100 border-yellow-200 text-yellow-700",
}

const STATUS_COLOR = {
    active:   "bg-green-100 border-green-200 text-green-700",
    inactive: "bg-red-100 border-red-200 text-red-700",
}

// ── Scope options per role ────────────────────────────────────────────────────
const SCOPE_OPTIONS = {
    "DC operator":   ["Pune Warehouse DC", "Mumbai Warehouse DC", "Nashik DC", "Nagpur DC"],
    "Store manager": ["Koregaon Park Store", "Hinjawadi Store", "FC Road Store", "Baner Store", "Kothrud Store"],
}

const ROLE_HINT = {
    "Brand manager": "Can see all trucks, trips and alerts for their brand",
    "DC operator":   "Can dispatch trips and manage trucks from their assigned DC",
    "Store manager": "Can track deliveries coming to their assigned store",
}

// ── Mock activity log ─────────────────────────────────────────────────────────
const MOCK_ACTIVITY = [
    { label: "Logged in",                 time: "Today, 09:14 AM"    },
    { label: "Viewed trip TRP-2841",      time: "Today, 09:16 AM"    },
    { label: "Exported trip history CSV", time: "Yesterday, 04:52 PM"},
    { label: "Acknowledged alert ALT-991",time: "Yesterday, 02:31 PM"},
    { label: "Logged in",                 time: "Yesterday, 09:00 AM"},
]

export default function EditUserDrawer({ open, setOpen, selectedUser }) {
    const [activeTab,        setActiveTab]        = useState("details")
    const [selectedRole,     setSelectedRole]     = useState(selectedUser?.role     ?? "")
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const [showDeactivate,   setShowDeactivate]   = useState(false)

    // Keep local role in sync when a different row is clicked
    const role = selectedRole || selectedUser?.role || ""

    if (!selectedUser) return null

    const showScope = role === "DC operator" || role === "Store manager"

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="bg-white min-w-120 flex flex-col p-0">

                {/* ── Header — same border-b border-gray-200 style ── */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
                    <SheetTitle>Edit user</SheetTitle>
                    <SheetDescription>{selectedUser.email}</SheetDescription>
                </SheetHeader>

                {/* ── User identity card — same bg-gray-100 rounded-md style as your draft ── */}
                <div className="px-6 pt-2">
                    <div className="flex gap-4 p-4 bg-gray-100 rounded-md items-center">
                        <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {selectedUser.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-semibold">{selectedUser.name}</h2>
                            <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className={`${ROLE_COLOR[selectedUser.role]} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
                                    {selectedUser.role}
                                </span>
                                <span className={`${STATUS_COLOR[selectedUser.status]} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
                                    {selectedUser.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Last login</p>
                            <p className="text-xs font-medium text-gray-600 mt-0.5">{selectedUser.lastLogin}</p>
                            <p className="text-[10px] text-gray-400">{selectedUser.loginDate}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    {/* Name row */}
                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel>First name</FieldLabel>
                                            <Input
                                                defaultValue={selectedUser.name.split(" ")[0]}
                                                placeholder="First name"
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input
                                                defaultValue={selectedUser.name.split(" ").slice(1).join(" ")}
                                                placeholder="Last name"
                                            />
                                        </Field>
                                    </div>

                                    {/* Email */}
                                    <Field>
                                        <FieldLabel>Email address</FieldLabel>
                                        <Input
                                            type="email"
                                            defaultValue={selectedUser.email}
                                            placeholder="user@brand.com"
                                        />
                                    </Field>

                                    {/* Role */}
                                    <Field>
                                        <FieldLabel>Role</FieldLabel>
                                        <Select
                                            defaultValue={selectedUser.role}
                                            onValueChange={(val) => setSelectedRole(val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Role</SelectLabel>
                                                    <SelectItem value="Brand manager">Brand Manager</SelectItem>
                                                    <SelectItem value="DC operator">DC Operator</SelectItem>
                                                    <SelectItem value="Store manager">Store Manager</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {role && (
                                            <FieldDescription className="text-xs">
                                                {ROLE_HINT[role]}
                                            </FieldDescription>
                                        )}
                                    </Field>

                                    {/* Brand */}
                                    <Field>
                                        <FieldLabel>Brand</FieldLabel>
                                        <Select defaultValue={selectedUser.brand}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select brand..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Brand</SelectLabel>
                                                    <SelectItem value="Tata Westside">Tata Westside</SelectItem>
                                                    <SelectItem value="Zudio">Zudio</SelectItem>
                                                    <SelectItem value="Tata Cliq">Tata Cliq</SelectItem>
                                                    <SelectItem value="Tanishq">Tanishq</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    {/* Scope — only shown for DC operator and Store manager */}
                                    {showScope && (
                                        <Field>
                                            <FieldLabel>
                                                {role === "DC operator" ? "Assigned DC" : "Assigned store"}
                                            </FieldLabel>
                                            <Select defaultValue={selectedUser.scope}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={`Select ${role === "DC operator" ? "data center" : "store"}...`} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border shadow-md">
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {role === "DC operator" ? "Data Centers" : "Stores"}
                                                        </SelectLabel>
                                                        {(SCOPE_OPTIONS[role] ?? []).map((opt) => (
                                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FieldDescription className="text-xs">
                                                {role === "DC operator"
                                                    ? "User will only see trucks and trips from this DC"
                                                    : "User will only see deliveries coming to this store"
                                                }
                                            </FieldDescription>
                                        </Field>
                                    )}

                                    {/* ── Danger zone — same red border card as DangerSection ── */}
                                    <div className="pt-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                            Account actions
                                        </p>

                                        {/* Reset password */}
                                        <div className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-200 bg-gray-50 mb-2">
                                            <div className="flex items-start gap-2">
                                                <KeyRound size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Reset password</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Send a password reset link to {selectedUser.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 text-xs"
                                                onClick={() => setShowResetConfirm(!showResetConfirm)}
                                            >
                                                Reset
                                            </Button>
                                        </div>

                                        {/* Reset confirm — inline, no modal */}
                                        {showResetConfirm && (
                                            <div className="mb-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3">
                                                <p className="text-xs text-blue-700">
                                                    Send reset link to <span className="font-medium">{selectedUser.email}</span>?
                                                </p>
                                                <div className="flex gap-2 shrink-0">
                                                    <Button size="sm" className="bg-maroon hover:bg-maroon-dark text-white text-xs h-7">
                                                        Send link
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs h-7"
                                                        onClick={() => setShowResetConfirm(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Deactivate */}
                                        <div className={`flex items-start justify-between gap-4 p-3 rounded-lg border ${
                                            selectedUser.status === "active"
                                                ? "border-red-200 bg-red-50"
                                                : "border-green-200 bg-green-50"
                                        }`}>
                                            <div className="flex items-start gap-2">
                                                <Ban size={14} className={`mt-0.5 shrink-0 ${selectedUser.status === "active" ? "text-red-500" : "text-green-600"}`} />
                                                <div>
                                                    <p className={`text-sm font-medium ${selectedUser.status === "active" ? "text-red-700" : "text-green-700"}`}>
                                                        {selectedUser.status === "active" ? "Deactivate account" : "Reactivate account"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {selectedUser.status === "active"
                                                            ? "User will immediately lose access to the platform"
                                                            : "User will regain access to the platform"
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowDeactivate(!showDeactivate)}
                                                className={`shrink-0 text-xs ${
                                                    selectedUser.status === "active"
                                                        ? "text-red-600 border-red-300 hover:bg-red-100"
                                                        : "text-green-600 border-green-300 hover:bg-green-100"
                                                }`}
                                            >
                                                {selectedUser.status === "active" ? "Deactivate" : "Reactivate"}
                                            </Button>
                                        </div>

                                        {/* Deactivate confirm — inline */}
                                        {showDeactivate && (
                                            <div className="mt-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3">
                                                <p className="text-xs text-red-700">
                                                    {selectedUser.status === "active"
                                                        ? `Deactivate ${selectedUser.name}? They will lose access immediately.`
                                                        : `Reactivate ${selectedUser.name}? They will regain access immediately.`
                                                    }
                                                </p>
                                                <div className="flex gap-2 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        className={`text-white text-xs h-7 ${
                                                            selectedUser.status === "active"
                                                                ? "bg-red-600 hover:bg-red-700"
                                                                : "bg-green-600 hover:bg-green-700"
                                                        }`}
                                                    >
                                                        Confirm
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs h-7"
                                                        onClick={() => setShowDeactivate(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                </div>

                {/* ── Footer — only shown on details tab ── */}
                {activeTab === "details" && (
                    <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200 px-6 py-4">
                        <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                            Save changes <UserRound className="ml-1" size={15} />
                        </Button>
                        <SheetClose className="basis-1/2" asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                )}

            </SheetContent>
        </Sheet>
    )
}