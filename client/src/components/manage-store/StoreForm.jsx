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
import { Plus, Store, Pencil } from "lucide-react"
import { useState } from "react"
import CreateFormSheetTrigger from "../CreateFormSheetTrigger"

export default function StoreForm({ mode, store }) {
    const isEdit = mode === "edit"
    // Auto-generate slug from store name
    //  {
    //     id: 1,
    //     name: "Westside — Koregaon Park",
    //     city: "Pune",
    //     address: "Shop 12, Phoenix Market City, Nagar Rd, Pune 411006",
    //     brand: "Tata Westside",
    //     managerName: "Arjun Joshi",
    //     managerPhone: "+91 98201 44321",
    //     managerEmail: "arjun.j@westside.com",
    //     publicTrackingSlug: "westside-koregaon",
    //     deliveriesToday: 2,
    //     totalDeliveries: 184,
    //     currentDevices: ["GPS-003-PUNE"],
    //     lastDelivery: "Today, 10:45 AM",
    //     status: "active",
    //     createdAt: "Jan 2023",
    // },
    const [form, setForm] = useState({
        brand: store?.brand || "",
        name: store?.name || "",
        city: store?.city || "",
        address: store?.address || "",
        publicTrackingSlug: store?.publicTrackingSlug || "",
        managerName: store?.managerName || "",
        managerPhone: store?.managerPhone || "",
        managerEmail: store?.managerEmail || "",
    })
    console.log(form);
    

    function handleFieldChange(name, value) {
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")

    return (
        <Sheet direction="right">
            {
                isEdit ? (
                    <SheetTrigger asChild>
                        <Button variant="outline" size="xs" className="hover:bg-maroon cursor-pointer hover:text-white"><Pencil size={16} /></Button>
                    </SheetTrigger>
                ) : (
                    <CreateFormSheetTrigger text={'Add Store'} />
                )
            }

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle> {isEdit ? "Edit store" : "Add new store"}</SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? "Update store details"
                            : "Register a retail store and assign it to a brand"}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* Brand */}
                                <Field>
                                    <FieldLabel>Brand <span className="text-red-500">*</span></FieldLabel>
                                    <Select value={form.brand} onValueChange={(value) => console.log(value)
                                    }>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select brand..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Brands</SelectLabel>
                                                <SelectItem value="Tata Westside">Tata Westside</SelectItem>
                                                <SelectItem value="Zudio">Zudio</SelectItem>
                                                <SelectItem value="Tata Cliq">Tata Cliq</SelectItem>
                                                <SelectItem value="Tanishq">Tanishq</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* Store name + city */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field className="basis-[65%]">
                                        <FieldLabel>Store name <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            name="name"
                                            placeholder="Westside — Koregaon Park"
                                            value={form.name}
                                            className="w-full placeholder:text-sm text-sm sm:text-md"
                                            onChange={({target: {name, value}}) => handleFieldChange(name,value)}
                                        />
                                    </Field>
                                    <Field className="basis-[35%]">
                                        <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
                                        <Select value={form.city} onValueChange={(value) => handleFieldChange('city', value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select city..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Cities</SelectLabel>
                                                    <SelectItem value="Pune">Pune</SelectItem>
                                                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                                                    <SelectItem value="Nashik">Nashik</SelectItem>
                                                    <SelectItem value="Nagpur">Nagpur</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Full address */}
                                <Field>
                                    <FieldLabel>Full address <span className="text-red-500">*</span></FieldLabel>
                                    <Input 
                                        name="address"
                                        value={form.address} 
                                        onChange={({target: {name, value}}) => handleFieldChange(name,value)} placeholder="Shop no., mall/building, area, pincode" 
                                        className="placeholder:text-sm text-sm sm:text-md" 
                                    />
                                    <FieldDescription className="text-xs">
                                        Used to place the store pin on the map and compute geofence
                                    </FieldDescription>
                                </Field>

                                {/* Geofence radius */}
                                {/* <Field>
                                    <FieldLabel>Geofence radius (metres)</FieldLabel>
                                    <Input type="number" placeholder="e.g. 200" defaultValue={200} />
                                    <FieldDescription className="text-xs">
                                        Truck entering this radius triggers the "arrived" event for the store manager
                                    </FieldDescription>
                                </Field> */}

                                {/* Public tracking slug — auto generated, editable */}
                                <Field>
                                    <FieldLabel>Public tracking URL slug</FieldLabel>
                                    <div className="flex items-center border rounded-md overflow-hidden">
                                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-2.5 border-r whitespace-nowrap">
                                            /track/
                                        </span>
                                        <Input
                                            className="border-0 rounded-none focus-visible:ring-0 font-mono text-sm placeholder:text-sm sm:text-md"
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel>Manager name</FieldLabel>
                                        <Input 
                                            name="managerName"
                                            value={form.managerName} 
                                            onChange={({target: {name, value}}) => handleFieldChange(name,value)} placeholder="e.g. Arjun Joshi" className="placeholder:text-sm text-sm sm:text-md" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Manager phone</FieldLabel>
                                        <Input 
                                            name="managerPhone"
                                            value={form.managerPhone} 
                                            onChange={({target: {name, value}}) => handleFieldChange(name,value)} placeholder="+91 98XXX XXXXX" className="placeholder:text-sm text-sm sm:text-md" />
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel>Manager email</FieldLabel>
                                    <Input 
                                        name="managerEmail"
                                        value={form.managerEmail} 
                                        onChange={({target: {name, value}}) => handleFieldChange(name,value)}  
                                        type="email" placeholder="manager@brand.com" className="placeholder:text-sm text-sm sm:text-md" />
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
                        {isEdit ? "Save Changes" : "Add Store"} <Store className="ml-1" size={15} />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}