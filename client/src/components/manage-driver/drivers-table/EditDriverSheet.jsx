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
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Edit driver</SheetTitle>
                    <SheetDescription>
                        Update details for {driver.name}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Name + Phone */}
                                <div  className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Full name</FieldLabel>
                                        <Input
                                            defaultValue={driver.name}
                                            placeholder="e.g. Ravi Deshmukh"
                                            className="text-sm"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Phone number</FieldLabel>
                                        <Input
                                            defaultValue={driver.phone}
                                            placeholder="+91 98XXX XXXXX"
                                            className="text-sm"
                                        />
                                    </Field>
                                </div>

                                {/* Licence number + class */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Licence number</FieldLabel>
                                        <Input
                                            defaultValue={driver.licenceNo}
                                            className="font-mono text-sm"
                                            placeholder="MH1220190012345"
                                            
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Licence class</FieldLabel>
                                        <Select defaultValue={driver.licenceClass.toLowerCase()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md text-sm">
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
                                    <Input type="date" className="text-sm"/>
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
                                                <SelectItem value="available" className="text-sm">Available</SelectItem>
                                                <SelectItem value="on_trip" className="text-sm">On trip</SelectItem>
                                                <SelectItem value="inactive" className="text-sm">Inactive</SelectItem>
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

                <SheetFooter className="flex flex-row sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                    <Button className="w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark">
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