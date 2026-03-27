import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BadgeAlert, Store } from 'lucide-react';


const STORE_SEED = [
  {
    id: "s1",
    name: "Pune FC Road Store",
    city: "Pune",
    address: "123 FC Road, Shivajinagar, Pune, Maharashtra 411005",
    email: "fcroad@store.com",
    contactNumber: "+91 9876543210"
  },
  {
    id: "s2",
    name: "Pune Koregaon Park Store",
    city: "Pune",
    address: "Lane 5, Koregaon Park, Pune, Maharashtra 411001",
    email: "koregaon@store.com",
    contactNumber: "+91 9876543211"
  },
  {
    id: "s3",
    name: "Mumbai Andheri Store",
    city: "Mumbai",
    address: "Andheri East, Mumbai, Maharashtra 400069",
    email: "andheri@store.com",
    contactNumber: "+91 9876543212"
  },
  {
    id: "s4",
    name: "Mumbai Lower Parel Store",
    city: "Mumbai",
    address: "Lower Parel, Mumbai, Maharashtra 400013",
    email: "lowerparel@store.com",
    contactNumber: "+91 9876543213"
  },
  {
    id: "s5",
    name: "Nashik Indira Nagar Store",
    city: "Nashik",
    address: "Indira Nagar, Nashik, Maharashtra 422009",
    email: "nashik@store.com",
    contactNumber: "+91 9876543214"
  },
  {
    id: "s6",
    name: "Nagpur Ashok Nagar Store",
    city: "Nagpur",
    address: "Ashok Nagar, Nagpur, Maharashtra 440022",
    email: "nagpur@store.com",
    contactNumber: "+91 9876543215"
  }
]


export default function DCStoreTable (){
    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

    const handleAssign = (device) => {
        setSelectedDevice(device)
        setOpen(true)
    }
    return (
        <>
        <section className="mt-6 max-w-400 mx-auto px-10">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="font-bold">Store Name</TableHead>
                            <TableHead className="font-bold">Addres</TableHead>
                            <TableHead className="font-bold">City</TableHead>
                            <TableHead className="font-bold">Contact Details</TableHead>
                            <TableHead className="font-bold">Edit</TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {STORE_SEED.map((store,i) => (
                            <TableRow key={i}>
                                <TableCell>{store['name']}</TableCell>
                                <TableCell>{store['address']}</TableCell>
                                
                                <TableCell className="text-blue-600 mr-4">{store['city']}</TableCell>
                                
                                <TableCell>
                                    <div className="flex flex-col">
                                        
                                        <p className="text-green-600">+91 {store['contactNumber']}</p>
                                        <p className="text-blue-600">{store['email']}</p>

                                    </div>
                                    
                                </TableCell>
                                <TableCell
                                    className="cursor-pointer "
                                    
                                    >
                                        <div>
                                            <p onClick={() => handleAssign(store)}
                                             className="text-maroon hover:underline">Edit Store</p>
                                            
                                        </div>
                                        </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {/* RIGHT SIDE FORM */}
                <Sheet open={open} onOpenChange={setOpen} className="">
                    <SheetContent className="w-[420px] flex flex-col h-full">

                    <SheetHeader className="border border-transparent border-b-gray-300">
                        <SheetTitle>
                            Edite Store
                            <p className="text-sm text-gray-500">Edit store details</p>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel htmlFor="f_name">Store Name</FieldLabel>
                                            <Input id="f_name" type="text" placeholder="Name" />
                                        </Field>
                                        
                                    </div>
                                    <Field>
                                            <FieldLabel htmlFor="l_name">Address</FieldLabel>
                                            <Textarea id="l_name" type="text" placeholder="Add address" />
                                    </Field>

                                    {/* <Field>
                                            <FieldLabel htmlFor="l_name">Address</FieldLabel>
                                            <Textarea id="l_name" type="text" placeholder="Add address" />
                                    </Field> */}
                                    <div className="flex gap-2">
                                        <Field>
                                                <FieldLabel htmlFor="l_name">City</FieldLabel>
                                                <Input id="l_name" type="text" placeholder="Add city" />
                                        </Field>
                                        <Field>
                                                <FieldLabel htmlFor="l_name">State</FieldLabel>
                                                <Input id="l_name" type="text" placeholder="Add state" />
                                        </Field>

                                        <Field>
                                                <FieldLabel htmlFor="l_name">Country</FieldLabel>
                                                <Input id="l_name" type="text" placeholder="Add country" />
                                        </Field>
                                    </div>
                                    <Field>
                                            <FieldLabel htmlFor="f_name">Email</FieldLabel>
                                            <Input id="f_name" type="text" placeholder="Email" />
                                    </Field>

                                    <Field>
                                            <FieldLabel htmlFor="f_name">Contact Number</FieldLabel>
                                            <Input id="f_name" type="text" placeholder="+91 XXXXX XXXXX" />
                                        </Field>
                                                             

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                <div className=" border border-transparent border border-t-gray-300 bottom-2 mb-2">
                    <SheetFooter className=" flex flex-row bottom-0">

                        <Button className="w-[50%] bg-maroon hover:bg-maroon-dark cursor-pointer">
                            Edit Store <Store />
                        </Button>
                        <Button className="w-[50%] cursor-pointer"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            >
                            Cancel
                        </Button>

                        
                    </SheetFooter>
                </div>                
                </SheetContent>
                </Sheet>
            </section>
        </>
    )
    
}