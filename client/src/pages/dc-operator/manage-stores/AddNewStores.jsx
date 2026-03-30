
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
import { Input } from "@/components/ui/input"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { Plus, CalendarClock, UserRound, Road, Store } from "lucide-react"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

const STORAGE_KEYS = {
    trucks: "dcTrucks",
    trips: "dcActiveTrips",
}

const TRUCK_SEED = [
    { id: "t1", truckNumber: "MH-14-KJ-1013", status: "idle" },
    { id: "t2", truckNumber: "MH-14-FG-7013", status: "idle" },
    { id: "t3", truckNumber: "MH-12-WE-2019", status: "idle" },
    { id: "t4", truckNumber: "MH-14-AD-1315", status: "idle" },
]

const DRIVER_SEED = [
    { id: "d1", driverName: "Nikhil Patil", },
    { id: "d2", driverName: "Siddharth Iyer", },
    { id: "d3", driverName: "Anita Sharma", },
    { id: "d4", driverName: "Ravi Kumar", }
]

export const GPS_DEVICE_SEED = [
    { id: "g1", deviceLabel: "GPS Unit A", imei: "356930060123456", status: "available" },
    { id: "g2", deviceLabel: "GPS Unit B", imei: "356930060234567", status: "available" },
    { id: "g3", deviceLabel: "GPS Unit C", imei: "356930060345678", status: "assigned" },
    { id: "g4", deviceLabel: "GPS Unit D", imei: "356930060456789", status: "available" },
    { id: "g5", deviceLabel: "GPS Unit E", imei: "356930060567890", status: "assigned" },
];

const STORE_SEED = [
    { id: "s1", name: "Pune FC Road Store", city: "Pune" },
    { id: "s2", name: "Pune Koregaon Park Store", city: "Pune" },
    { id: "s3", name: "Mumbai Andheri Store", city: "Mumbai" },
    { id: "s4", name: "Mumbai Lower Parel Store", city: "Mumbai" },
    { id: "s5", name: "Nashik Indira Nagar Store", city: "Nashik" },
    { id: "s6", name: "Nagpur Ashok Nagar Store", city: "Nagpur" },
]

export default function AddNewStore() {
    const [form, setForm] = useState({
        storeName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        email: "",
        contactNumber: "",
        status: ""
    })

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAddStore = () => {
        const storeData = {
            ...form,
            createdAt: new Date().toISOString()
        }

        console.log("Saving Store:", storeData)

        // Save to API / localStorage here
    }

    return (
        <div>
            <Sheet>
                <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Add new store
                </SheetTrigger>

                <SheetContent className="bg-white min-w-125 flex flex-col">
                    <SheetHeader className="border-b border-gray-200 pb-4">
                        <SheetTitle>Add new store</SheetTitle>
                        <SheetDescription>
                            Add store details with location.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel>Store Name</FieldLabel>
                                            <Input
                                                value={form.storeName}
                                                onChange={(e) => handleChange("storeName", e.target.value)}
                                                placeholder="Name"
                                            />
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel>Address</FieldLabel>
                                        <Textarea
                                            value={form.address}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                            placeholder="Add address"
                                        />
                                    </Field>

                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel>City</FieldLabel>
                                            <Input
                                                value={form.city}
                                                onChange={(e) => handleChange("city", e.target.value)}
                                                placeholder="Add city"
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel>State</FieldLabel>
                                            <Input
                                                value={form.state}
                                                onChange={(e) => handleChange("state", e.target.value)}
                                                placeholder="Add state"
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel>Country</FieldLabel>
                                            <Input
                                                value={form.country}
                                                onChange={(e) => handleChange("country", e.target.value)}
                                                placeholder="Add country"
                                            />
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            value={form.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            placeholder="Email"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel>Contact Number</FieldLabel>
                                        <Input
                                            value={form.contactNumber}
                                            onChange={(e) => handleChange("contactNumber", e.target.value)}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel>Status</FieldLabel>

                                        <Select
                                            value={form.status}
                                            onValueChange={(value) => handleChange("status", value)}
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
                                    </Field>

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">

                        <Button
                            onClick={handleAddStore}
                            className='basis-1/2 bg-maroon hover:bg-maroon-dark'
                        >
                            Add store <Store />
                        </Button>

                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">
                                Cancel
                            </Button>
                        </SheetClose>

                    </SheetFooter>

                </SheetContent>
            </Sheet>
        </div>
    )
    // const [selectedTruck, setSelectedTruck] = useState(null)
    // const [selectedDriver, setSelectedDriver] = useState(null)
    // const [selectedGps, setSelectedGps] = useState(null)
    // const [selectedStore, setSelectedStore] = useState(null);
    // const [createNewDriver, setCreateNewDriver] = useState(false)

    // console.log(selectedDriver, selectedTruck);

    // return (
    //     <div>
    //         <Sheet direction="right" className="">
    //             <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2"><Plus className="w-4 h-4 mr-1" />
    //                 Create New Trip</SheetTrigger>
    //             <SheetContent className="bg-white min-w-[500px]">
    //                 <SheetHeader className="border-b border-gray-200">
    //                     <SheetTitle>Create new trip</SheetTitle>
    //                     <SheetDescription>Assign a truck and driver to a new route, and link a GPS device for real-time tracking.</SheetDescription>
    //                 </SheetHeader>
    //                 <div className="p-4">
    //                     <FieldGroup>
    //                         <FieldSet>
    //                             <FieldGroup>
    //                                 <div className="flex gap-2">
    //                                     <Field>
    //                                         <FieldLabel>Assign Trucks</FieldLabel>
    //                                         <Combobox items={TRUCK_SEED} value={selectedTruck}
    //                                             onValueChange={(truck) => setSelectedTruck(truck?.id)}
    //                                             itemToStringLabel={(truck) => truck.truckNumber}
    //                                             itemToStringValue={(truck) => truck.id}
    //                                         >
    //                                             <ComboboxInput placeholder="Search/Select a truck" />
    //                                             <ComboboxContent>
    //                                                 <ComboboxEmpty>No items found.</ComboboxEmpty>
    //                                                 <ComboboxList>
    //                                                     {(truck) => (
    //                                                         <ComboboxItem key={truck.id} value={truck.id}>
    //                                                             {truck.truckNumber}
    //                                                         </ComboboxItem>
    //                                                     )}
    //                                                 </ComboboxList>
    //                                             </ComboboxContent>
    //                                         </Combobox>


    //                                     </Field>


    //                                     <Field>
    //                                         <FieldLabel>Assign GPS Device</FieldLabel>
    //                                         <Combobox items={GPS_DEVICE_SEED} value={selectedGps}
    //                                             onValueChange={(gps) => setSelectedGps(gps?.id)}
    //                                             itemToStringValue={(gps) => gps.id}
    //                                         >
    //                                             <ComboboxInput placeholder="Search/Select a gps device" />
    //                                             <ComboboxContent>
    //                                                 <ComboboxEmpty>No items found.</ComboboxEmpty>
    //                                                 <ComboboxList>
    //                                                     {(gps) => (
    //                                                         <ComboboxItem key={gps.id} value={gps.id}>
    //                                                             {gps.imei}
    //                                                         </ComboboxItem>
    //                                                     )}
    //                                                 </ComboboxList>
    //                                             </ComboboxContent>
    //                                         </Combobox>

    //                                     </Field>
    //                                 </div>

    //                                 <div>
    //                                     <div className="flex items-center justify-between mb-2">
    //                                         <FieldLabel>Assign Driver</FieldLabel>

    //                                         <button
    //                                             type="button"
    //                                             onClick={() => setCreateNewDriver(prev => !prev)}
    //                                             className="text-xs text-maroon hover:underline"
    //                                         >
    //                                             {createNewDriver ? "Select existing" : "+ Add new"}
    //                                         </button>
    //                                     </div>

    //                                     {!createNewDriver ? (
    //                                         <Field>
    //                                             <Combobox
    //                                                 items={DRIVER_SEED}
    //                                                 value={selectedDriver}
    //                                                 onValueChange={(driver) => setSelectedDriver(driver?.id)}
    //                                                 itemToStringValue={(driver) => driver.id}
    //                                             >
    //                                                 <ComboboxInput placeholder="Search/Select a driver" />
    //                                                 <ComboboxContent>
    //                                                     <ComboboxEmpty>No items found.</ComboboxEmpty>
    //                                                     <ComboboxList>
    //                                                         {(driver) => (
    //                                                             <ComboboxItem key={driver.id} value={driver.id}>
    //                                                                 {driver.driverName}
    //                                                             </ComboboxItem>
    //                                                         )}
    //                                                     </ComboboxList>
    //                                                 </ComboboxContent>
    //                                             </Combobox>
    //                                         </Field>
    //                                     ) : (
    //                                         <div className="space-y-3 border rounded-md p-3 bg-gray-50">
    //                                             <p className="text-xs font-medium text-gray-600">New Driver Details</p>

    //                                             <div className="grid grid-cols-2 gap-2">
    //                                                 <Field>
    //                                                     <FieldLabel>Name</FieldLabel>
    //                                                     <Input placeholder="Driver name" />
    //                                                 </Field>

    //                                                 <Field>
    //                                                     <FieldLabel>Phone</FieldLabel>
    //                                                     <Input type="tel" placeholder="10-digit number" />
    //                                                 </Field>
    //                                             </div>

    //                                             <div className="flex gap-2 items-end">
    //                                                 <Field className="flex-1">
    //                                                     <FieldLabel>OTP</FieldLabel>
    //                                                     <Input placeholder="Enter OTP" />
    //                                                 </Field>

    //                                                 <Button type="button" variant="outline" className="h-9">
    //                                                     Send OTP
    //                                                 </Button>
    //                                             </div>

    //                                             <Field>
    //                                                 <FieldLabel>Aadhaar Upload</FieldLabel>
    //                                                 <Input type="file" accept="image/*,.pdf" />
    //                                             </Field>
    //                                         </div>
    //                                     )}
    //                                 </div>

    //                                 <Field>
    //                                     <FieldLabel>Add Stops</FieldLabel>

    //                                     <div className="flex gap-2">
    //                                         <Combobox items={STORE_SEED} value={selectedStore}
    //                                             onValueChange={(store) => setSelectedStore(store?.id)}
    //                                             itemToStringValue={(store) => store.id}
    //                                         >
    //                                             <ComboboxInput placeholder="Search store" />
    //                                             <ComboboxContent>
    //                                                 <ComboboxEmpty>No stores</ComboboxEmpty>
    //                                                 <ComboboxList>
    //                                                     {(store) => (
    //                                                         <ComboboxItem key={store.id} value={store.id}>
    //                                                             {store.name}
    //                                                         </ComboboxItem>
    //                                                     )}
    //                                                 </ComboboxList>
    //                                             </ComboboxContent>
    //                                         </Combobox>

    //                                     </div>
    //                                 </Field>

    //                             </FieldGroup>
    //                         </FieldSet>
    //                     </FieldGroup>
    //                 </div>
    //                 <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
    //                     <Button className='basis-1/2 bg-maroon hover:bg-maroon-dark'>Create Trip <Road /></Button>
    //                     <SheetClose className='basis-1/2' asChild>
    //                         <Button className="w-full" variant="outline">Cancel</Button>
    //                     </SheetClose>
    //                 </SheetFooter>
    //             </SheetContent>
    //         </Sheet>
    //     </div>
    // )
}