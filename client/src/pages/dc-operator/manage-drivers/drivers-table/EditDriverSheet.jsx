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
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { BookUser } from "lucide-react"

export default function EditDriverSheet({ driver, open, onClose }) {
    if (!driver) return null

    return (
        <Sheet open={open} onOpenChange={onClose} direction="right">
            <SheetContent className="bg-white min-w-120">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Edit driver</SheetTitle>
                    <SheetDescription>
                        Update details for {driver.name}
                    </SheetDescription>
                </SheetHeader>

                <div className="p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Name + Phone */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Full name</FieldLabel>
                                        <Input
                                            defaultValue={driver.name}
                                            placeholder="e.g. Ravi Deshmukh"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Phone number</FieldLabel>
                                        <Input
                                            defaultValue={driver.phone}
                                            placeholder="+91 98XXX XXXXX"
                                        />
                                    </Field>
                                </div>

                                {/* Licence number + class */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Licence number</FieldLabel>
                                        <Input
                                            defaultValue={driver.licenceNo}
                                            className="font-mono"
                                            placeholder="MH1220190012345"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Licence class</FieldLabel>
                                        <Select defaultValue={driver.licenceClass.toLowerCase()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Class</SelectLabel>
                                                     <SelectItem value="all_licences">All classes</SelectItem>
                                    <SelectItem value="lmv">LMV - light motor vehicles/cars</SelectItem>
                                    <SelectItem value="hmv">HMV - heavy motor vehicles</SelectItem>
                                    <SelectItem value="hgmv">HGMV - heavy goods motor vehicle</SelectItem>
                                    <SelectItem value="htv">HTV - heavy transport vehicle</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Licence expiry */}
                                <Field>
                                    <FieldLabel>Licence expiry</FieldLabel>
                                    <Input type="date" />
                                </Field>

                                {/* Status */}
                                <Field>
                                    <FieldLabel>Status</FieldLabel>
                                    <Select defaultValue={driver.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="on_trip">On trip</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription className="text-xs">
                                        Setting to inactive hides this driver from dispatch forms
                                    </FieldDescription>
                                </Field>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                        Save changes <BookUser className="ml-1" size={15} />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}