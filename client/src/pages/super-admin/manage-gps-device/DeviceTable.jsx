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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react";

const gpsDevices = [
  {
    "DeviceIMEI": "359881234567890",
    "SIM Number": "9876543210",
    "Truck Assign": "MH 12 TR 9087",
    "Brand": "Teltonika",
    "Health Check": "Online",
    "Status": "Active"
  },
  {
    "DeviceIMEI": "359881234567891",
    "SIM Number": "9876543211",
    "Truck Assign": "GJ 18 TT 4433",
    "Brand": "Queclink",
    "Health Check": "Offline",
    "Status": "Inactive"
  },
  {
    "DeviceIMEI": "359881234567892",
    "SIM Number": "9876543212",
    "Truck Assign": "KA 51 TR 2201",
    "Brand": "Ruptela",
    "Health Check": "Online",
    "Status": "Active"
  },
  {
    "DeviceIMEI": "359881234567893",
    "SIM Number": "9876543213",
    "Truck Assign": "TN 58 AB 9922",
    "Brand": "Concox",
    "Health Check": "Offline",
    "Status": "Maintenance"
  },
  {
    "DeviceIMEI": "359881234567894",
    "SIM Number": "9876543214",
    "Truck Assign": "RJ 14 TR 7788",
    "Brand": "Teltonika",
    "Health Check": "Online",
    "Status": "Active"
  },
  {
    "DeviceIMEI": "359881234567895",
    "SIM Number": "9876543215",
    "Truck Assign": "UP 32 TT 5544",
    "Brand": "Queclink",
    "Health Check": "Offline",
    "Status": "Inactive"
  },
  {
    "DeviceIMEI": "359881234567896",
    "SIM Number": "9876543216",
    "Truck Assign": "HR 38 TR 2211",
    "Brand": "Ruptela",
    "Health Check": "Online",
    "Status": "Active"
  },
  {
    "DeviceIMEI": "359881234567897",
    "SIM Number": "9876543217",
    "Truck Assign": "PB 10 AB 4455",
    "Brand": "Concox",
    "Health Check": "Offline",
    "Status": "Maintenance"
  },
  {
    "DeviceIMEI": "359881234567898",
    "SIM Number": "9876543218",
    "Truck Assign": "MP 09 TR 6677",
    "Brand": "Teltonika",
    "Health Check": "Online",
    "Status": "Active"
  },
  {
    "DeviceIMEI": "359881234567899",
    "SIM Number": "9876543219",
    "Truck Assign": "CG 04 TT 9911",
    "Brand": "Queclink",
    "Health Check": "Offline",
    "Status": "Inactive"
  }
];

export default function DeviceTable() {
    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

    const handleAssign = (device) => {
        setSelectedDevice(device)
        setOpen(true)
    }
    return (
        <>
        <section className="mt-6 max-w-400 mx-auto">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Device IMEI</TableHead>
                            <TableHead>SIM Number</TableHead>
                            <TableHead>Truck Assign</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Health Check</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gpsDevices.map((device,i) => (
                            <TableRow key={i}>
                                <TableCell>{device['DeviceIMEI']}</TableCell>
                                <TableCell>{device['SIM Number']}</TableCell>
                                <TableCell
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => handleAssign(device)}
                                    >
                                    {device["Truck Assign"] || "Assign Truck"}
                                </TableCell>
                                <TableCell>{device['Brand']}</TableCell>
                                <TableCell>{device['Health Check']}</TableCell>
                                <TableCell>{device['Status']}</TableCell>
                                {/* <TableCell>{device.status}</TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {/* RIGHT SIDE FORM */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className="w-[420px]">

                    <SheetHeader>
                        <SheetTitle>Assign Truck</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-5 mt-6">

                        {/* Device IMEI */}
                        <div>
                        <label className="text-sm font-medium">
                            Device IMEI
                        </label>
                        <Input
                            value={selectedDevice?.["Device IMEI"] || ""}
                            disabled
                        />
                        </div>


                        {/* SIM Number */}
                        <div>
                        <label className="text-sm font-medium">
                            SIM Number
                        </label>
                        <Input
                            value={selectedDevice?.["SIM Number"] || ""}
                            disabled
                        />
                        </div>


                        {/* Assign Truck */}
                        <div>
                        <label className="text-sm font-medium">
                            Assign Truck
                        </label>

                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Select Truck" />
                            </SelectTrigger>

                            <SelectContent>
                            <SelectItem value="MH12">
                                MH 12 TR 9087
                            </SelectItem>

                            <SelectItem value="GJ18">
                                GJ 18 TT 4433
                            </SelectItem>

                            <SelectItem value="KA51">
                                KA 51 TR 2201
                            </SelectItem>

                            <SelectItem value="TN58">
                                TN 58 AB 9922
                            </SelectItem>
                            </SelectContent>

                        </Select>
                        </div>


                        {/* Brand */}
                        <div>
                        <label className="text-sm font-medium">
                            Brand
                        </label>
                        <Input
                            value={selectedDevice?.Brand || ""}
                            disabled
                        />
                        </div>


                        {/* Health Check */}
                        <div>
                        <label className="text-sm font-medium">
                            Health Check
                        </label>
                        <Input
                            value={selectedDevice?.["Health Check"] || ""}
                            disabled
                        />
                        </div>

                    </div>


                    <SheetFooter className="mt-6">
                        <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        >
                        Cancel
                        </Button>

                        <Button>
                        Save
                        </Button>
                    </SheetFooter>

                    </SheetContent>
                </Sheet>
        </section>

        

       
        </>
    )
}