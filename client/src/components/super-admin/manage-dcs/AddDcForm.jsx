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
import { Plus, Warehouse } from "lucide-react"
import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"

export default function AddDCForm() {
    return (
        <Sheet direction="right">
            <CreateFormSheetTrigger text='Add a DC'/>
            
            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Add new warehouse</SheetTitle>
                    <SheetDescription>
                        Register a new data center and assign it to a brand
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-3 pb-3 sm:p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Brand */}
                                {/* <Field>
                                    <FieldLabel>Brand <span className="text-red-500">*</span></FieldLabel>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select brand..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Brands</SelectLabel>
                                                <SelectItem value="tata_westside">Tata Westside</SelectItem>
                                                <SelectItem value="zudio">Zudio</SelectItem>
                                                <SelectItem value="tata_cliq">Tata Cliq</SelectItem>
                                                <SelectItem value="tanishq">Tanishq</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription className="text-xs">
                                        This DC will only manage trucks and trips for this brand
                                    </FieldDescription>
                                </Field> */}

                                {/* DC name + city */}
                                <div  className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>DC name <span className="text-red-500">*</span></FieldLabel>
                                        <Input placeholder="e.g. Pune Warehouse DC" className="placeholder:text-sm text-sm sm:text-md"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
                                        <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select city..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Cities</SelectLabel>
                                                <SelectItem value="pune">Pune</SelectItem>
                                                <SelectItem value="mumbai">Mumbai</SelectItem>
                                                <SelectItem value="nashik">Nashik</SelectItem>
                                                <SelectItem value="nagpur">Nagpur</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    </Field>
                                </div>

                                {/* Full address */}
                                <Field>
                                    <FieldLabel>Full address <span className="text-red-500">*</span></FieldLabel>
                                    <Input placeholder="Plot no., area, pincode" className="placeholder:text-sm text-sm sm:text-md"/>
                                    <FieldDescription className="text-xs">
                                        Used to geocode the DC location on the map
                                    </FieldDescription>
                                </Field>

                                {/* Geofence radius */}
                                {/* <Field>
                                    <FieldLabel>Geofence radius (metres)</FieldLabel>
                                    <Input type="number" placeholder="e.g. 300" defaultValue={300} />
                                    <FieldDescription className="text-xs">
                                        Truck entering this radius triggers a "returned to DC" event
                                    </FieldDescription>
                                </Field> */}

                                {/* Contact person */}
                                <div  className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Operator name</FieldLabel>
                                        <Input placeholder="e.g. Suresh Pawar" className="placeholder:text-sm text-sm sm:text-md"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Operator phone</FieldLabel>
                                        <Input placeholder="+91 98XXX XXXXX" className="placeholder:text-sm text-sm sm:text-md"/>
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel>Operator email</FieldLabel>
                                    <Input type="email" placeholder="operator@brand.com" className="placeholder:text-sm text-sm sm:text-md"/>
                                    <FieldDescription className="text-xs">
                                        A user account with DC operator role will be created for this email
                                    </FieldDescription>
                                </Field>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>


                <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                    <Button className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>Add Warehouse <Warehouse /></Button>
                    <SheetClose className='basis-1/2' asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}