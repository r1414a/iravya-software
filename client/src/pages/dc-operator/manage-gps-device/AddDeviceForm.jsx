import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Cpu } from "lucide-react"

export default function AddDeviceForm() {
    return (
        <Sheet direction="right">
            <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2">
                <Plus className="w-4 h-4 mr-2" />
                Register Device
            </SheetTrigger>

            <SheetContent className="bg-white min-w-120 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Register GPS device</SheetTitle>
                    <SheetDescription>
                        Add a new tracking device, link it to a truck, and configure its SIM
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Device ID + IMEI */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Device ID</FieldLabel>
                                        <Input
                                            placeholder="e.g. GPS-006-PUNE"
                                            className="font-mono uppercase"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>IMEI number</FieldLabel>
                                        <Input
                                            placeholder="15-digit IMEI"
                                            className="font-mono"
                                            maxLength={15}
                                        />
                                    </Field>
                                </div>

                                {/* SIM + firmware */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>SIM card number</FieldLabel>
                                        <Input placeholder="e.g. 9833012345" className="font-mono" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Firmware version</FieldLabel>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Version</SelectLabel>
                                                    <SelectItem value="v2.4.1">v2.4.1 (latest)</SelectItem>
                                                    <SelectItem value="v2.4.0">v2.4.0</SelectItem>
                                                    <SelectItem value="v2.3.8">v2.3.8</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Assign to truck (optional) */}
                                <Field>
                                    <FieldLabel>
                                        Assign to truck
                                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                    </FieldLabel>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select truck..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Trucks without a device</SelectLabel>
                                                <SelectItem value="MH20GH7788">MH20GH7788 — Eicher Pro</SelectItem>
                                                <SelectItem value="MH09MN6789">MH09MN6789 — Tata 407</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription className="text-xs">
                                        Only trucks without an active GPS device are listed
                                    </FieldDescription>
                                </Field>

                                {/* Install date */}
                                <Field>
                                    <FieldLabel>Install date</FieldLabel>
                                    <Input type="date" />
                                </Field>

                                {/* Info note */}
                                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-2.5">
                                    <Cpu size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        The device will authenticate via IMEI over MQTT (TLS).
                                        It will appear <strong>Offline</strong> until the first ping is received.
                                    </p>
                                </div>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                        Register <Cpu className="ml-1" size={15} />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}