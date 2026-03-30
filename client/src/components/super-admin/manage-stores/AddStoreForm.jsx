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
import { Plus, Store } from "lucide-react"
import { useState } from "react"

export default function AddStoreForm() {
    // Auto-generate slug from store name
    const [storeName, setStoreName] = useState("")
    const slug = storeName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")

    return (
        <Sheet direction="right">
            <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Store
            </SheetTrigger>

            <SheetContent className="bg-white min-w-120 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Add new store</SheetTitle>
                    <SheetDescription>
                        Register a retail store and assign it to a brand
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Brand */}
                                <Field>
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
                                </Field>

                                {/* Store name + city */}
                                <div className="flex gap-2">
                                    <Field className="basis-[65%]">
                                        <FieldLabel>Store name <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            placeholder="e.g. Westside — Koregaon Park"
                                            value={storeName}
                                            className="w-full"
                                            onChange={(e) => setStoreName(e.target.value)}
                                        />
                                    </Field>
                                    <Field className="basis-[35%]">
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
                                    <Input placeholder="Shop no., mall/building, area, pincode" />
                                    <FieldDescription className="text-xs">
                                        Used to place the store pin on the map and compute geofence
                                    </FieldDescription>
                                </Field>

                                {/* Geofence radius */}
                                <Field>
                                    <FieldLabel>Geofence radius (metres)</FieldLabel>
                                    <Input type="number" placeholder="e.g. 200" defaultValue={200} />
                                    <FieldDescription className="text-xs">
                                        Truck entering this radius triggers the "arrived" event for the store manager
                                    </FieldDescription>
                                </Field>

                                {/* Public tracking slug — auto generated, editable */}
                                <Field>
                                    <FieldLabel>Public tracking URL slug</FieldLabel>
                                    <div className="flex items-center border rounded-md overflow-hidden">
                                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-2.5 border-r whitespace-nowrap">
                                            /track/
                                        </span>
                                        <Input
                                            className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm"
                                            value={slug}
                                            placeholder="auto-generated"
                                            readOnly
                                        />
                                    </div>
                                    <FieldDescription className="text-xs">
                                        Auto-generated from store name. Store can share this URL for public delivery tracking.
                                    </FieldDescription>
                                </Field>

                                {/* Store manager */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Manager name</FieldLabel>
                                        <Input placeholder="e.g. Arjun Joshi" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Manager phone</FieldLabel>
                                        <Input placeholder="+91 98XXX XXXXX" />
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel>Manager email</FieldLabel>
                                    <Input type="email" placeholder="manager@brand.com" />
                                    <FieldDescription className="text-xs">
                                        A user account with store manager role will be created for this email
                                    </FieldDescription>
                                </Field>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                        Add Store <Store className="ml-1" size={15} />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}