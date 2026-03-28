import { useState } from "react"
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
import { Plus, BookUser } from "lucide-react"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"


export default function ManageDriverForm() {
    const [open, setOpen] = useState(false)

    return (

        <Sheet direction="right" className="">
            <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2"><Plus className="w-4 h-4 mr-2" />
                Create Driver</SheetTrigger>
            <SheetContent className="bg-white min-w-120">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Create new driver</SheetTitle>
                    <SheetDescription>Add driver details and licence information</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Full name</FieldLabel>
                                        <Input placeholder="e.g. Ravi Deshmukh" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Phone number</FieldLabel>
                                        <Input placeholder="+91 98XXX XXXXX" />
                                    </Field>
                                </div>

                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Licence number</FieldLabel>
                                        <Input placeholder="e.g. MH1220190012345" className="font-mono" />
                                    </Field>


                                    <Field>
                                        <FieldLabel>Licence class</FieldLabel>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
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

                                <Field>
                                    <FieldLabel>Licence expiry</FieldLabel>
                                    <Input type="date" />
                                </Field>

                                {/* <Field>
                                    <FieldLabel>Assign to truck <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select idle truck..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Idle trucks</SelectLabel>
                                                <SelectItem value="MH12AB1234">MH12AB1234</SelectItem>
                                                <SelectItem value="MH14CD5678">MH14CD5678</SelectItem>
                                                <SelectItem value="MH12XY9090">MH12XY9090</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field> */}
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className='basis-1/2 bg-maroon hover:bg-maroon-dark'>Add Driver <BookUser /></Button>
                    <SheetClose className='basis-1/2' asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}