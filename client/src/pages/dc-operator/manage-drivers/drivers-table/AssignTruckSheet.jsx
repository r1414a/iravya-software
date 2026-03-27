import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Truck } from "lucide-react"

// Idle trucks at this DC — in real app this comes from your API
const IDLE_TRUCKS = [
    { reg: "MH12AB1234", capacity: "10 ton" },
    { reg: "MH14CD5678", capacity: "8 ton"  },
    { reg: "MH12XY9090", capacity: "12 ton" },
    { reg: "MH20IJ7890", capacity: "10 ton" },
]

export default function AssignTruckSheet({ driver, open, onClose }) {
    if (!driver) return null

    return (
        <Sheet open={open} onOpenChange={onClose} direction="right">
            <SheetContent className="bg-white min-w-120">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Assign truck</SheetTitle>
                    <SheetDescription>
                        Assign an idle truck to {driver.name}
                    </SheetDescription>
                </SheetHeader>

                <div className="p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Current assignment info card */}
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                    <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white text-sm font-semibold">
                                        {driver.initials}
                                    </div>
                                    <div className="-space-y-0.5">
                                        <p className="text-sm font-medium">{driver.name}</p>
                                        <p className="text-xs text-gray-400">
                                            Currently assigned to:{" "}
                                            <span className="font-mono text-gray-600">
                                                {driver.assignedTruck ?? "No truck"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Truck select */}
                                <Field>
                                    <FieldLabel>Select truck</FieldLabel>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select idle truck..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Idle trucks at this DC</SelectLabel>
                                                {IDLE_TRUCKS.map((t) => (
                                                    <SelectItem key={t.reg} value={t.reg}>
                                                        {t.reg}
                                                        <span className="ml-2 text-gray-400 text-xs">
                                                            {t.capacity}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription className="text-xs">
                                        Only trucks with no current driver assignment are shown
                                    </FieldDescription>
                                </Field>

                                {/* Unassign option */}
                                {driver.assignedTruck && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id="unassign"
                                            className="accent-maroon cursor-pointer"
                                        />
                                        <label
                                            htmlFor="unassign"
                                            className="text-sm text-gray-600 cursor-pointer"
                                        >
                                            Remove current assignment ({driver.assignedTruck})
                                        </label>
                                    </div>
                                )}

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                        Assign truck <Truck className="ml-1" size={15} />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}