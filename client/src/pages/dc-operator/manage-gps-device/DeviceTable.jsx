import { useState } from "react"
import DeviceDetailDrawer from "./DeviceDetailDrawer"
import { DataTable } from "./device-table/data-table"
import { columns } from "./device-table/columns"

const devices = [
    {
        id: 1,
        deviceId: "GPS-001-PUNE",
        imei: "354678901234560",
        simNo: "9833012345",
        firmware: "v2.4.1",
        assignedTruck: "MH12AB1234",
        assignedTruckType: "heavy",
        brand: "Tata Westside",
        status: "online",
        lastPing: "8s ago",
        lastPingDate: "Today, 10:42 AM",
        signalStrength: 87,
        battery: 92,
        totalTrips: 148,
        tripsThisMonth: 9,
        location: "Pune–Mumbai Expressway",
        installDate: "Jan 2023",
    },
    {
        id: 2,
        deviceId: "GPS-002-PUNE",
        imei: "354678901234561",
        simNo: "9833012346",
        firmware: "v2.4.1",
        assignedTruck: "MH14CD5678",
        assignedTruckType: "medium",
        brand: "Zudio",
        status: "online",
        lastPing: "12s ago",
        lastPingDate: "Today, 10:42 AM",
        signalStrength: 74,
        battery: 68,
        totalTrips: 87,
        tripsThisMonth: 5,
        location: "Hinjawadi Rd, Pune",
        installDate: "Jun 2023",
    },
    {
        id: 3,
        deviceId: "GPS-003-PUNE",
        imei: "354678901234562",
        simNo: "9833012347",
        firmware: "v2.3.8",
        assignedTruck: "MH12XY9090",
        assignedTruckType: "mini_truck",
        brand: "Tata Cliq",
        status: "offline",
        lastPing: "6h ago",
        lastPingDate: "Today, 04:15 AM",
        signalStrength: 0,
        battery: 41,
        totalTrips: 211,
        tripsThisMonth: 0,
        location: "Last: Mumbai Warehouse",
        installDate: "Feb 2022",
    },
    {
        id: 4,
        deviceId: "GPS-004-PUNE",
        imei: "354678901234563",
        simNo: "9833012348",
        firmware: "v2.4.0",
        assignedTruck: null,
        assignedTruckType: null,
        brand: null,
        status: "unassigned",
        lastPing: "Never",
        lastPingDate: "—",
        signalStrength: 0,
        battery: 100,
        totalTrips: 0,
        tripsThisMonth: 0,
        location: "—",
        installDate: "Mar 2026",
    },
    {
        id: 5,
        deviceId: "GPS-005-PUNE",
        imei: "354678901234564",
        simNo: "9833012349",
        firmware: "v2.4.1",
        assignedTruck: "MH04EF3344",
        assignedTruckType: "heavy",
        brand: "Tata Westside",
        status: "warning",
        lastPing: "4m ago",
        lastPingDate: "Today, 10:38 AM",
        signalStrength: 23,
        battery: 11,
        totalTrips: 57,
        tripsThisMonth: 4,
        location: "Baner, Pune",
        installDate: "Sep 2024",
    },
]

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck } from 'lucide-react';

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

    const [editdeviceopen, seteditdeviceOpen] = useState(false)
    // const [selectedDevice, setSelectedDevice] = useState(null)

    const handleAssign = (device) => {
        setSelectedDevice(device)
        setOpen(true)
    }

    const editGpsDevice = () =>{
        setSelectedDevice(device)
        seteditdeviceOpen(true)
    }
    return (
        <>
        <section className="mt-6 max-w-400 mx-auto px-10">
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
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gpsDevices.map((device,i) => (
                            <TableRow key={i}>
                                <TableCell className="text-blue-600">{device['DeviceIMEI']}</TableCell>
                                <TableCell className="text-green-600">{device['SIM Number']}</TableCell>
                                <TableCell
                                    
                                    >
                                    <p>{device["Truck Assign"]}</p>
                                    <p className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => handleAssign(device)} >Assign truck</p>
                                </TableCell>
                                <TableCell>{device['Brand']}</TableCell>
                                <TableCell>{device['Health Check']}</TableCell>
                                <TableCell>{device['Status']}</TableCell>
                                <TableCell className="cursor-pointer text-maroon hover:underline"
                                    onClick={() => editGpsDevice(device)}
                        
                                >Edit GPS Device</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {/* RIGHT SIDE FORM */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className="w-[420px] ">

                    <SheetHeader className="border border-transparent border-b-gray-400">
                        <SheetTitle>
                            Assign Truck
                        </SheetTitle>
                        <p className="text-sm text-gray-500">Assign truck to gps devices</p>
                    </SheetHeader>

                    <div className="space-y-5 mt-6 p-5 flex-1 overflow-auto">

                        {/* Device IMEI */}
                        <div>
                        <label className="text-sm font-medium">
                            Device IMEI
                        </label>
                        <Input
                            value={selectedDevice?.["DeviceIMEI"] || ""}
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
                            <SelectItem value="MH 12 TR 9087">
                                MH 12 TR 9087
                            </SelectItem>

                            <SelectItem value="GJ 18 TT 4433">
                                GJ 18 TT 4433
                            </SelectItem>

                            <SelectItem value="KA 51 TR 2201">
                                KA 51 TR 2201
                            </SelectItem>

                            <SelectItem value="TN 58 AB 9922">
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


                    <div className=" border border-transparent border border-t-gray-300 bottom-2 mb-2">
                        <SheetFooter className=" flex flex-row bottom-0">

                            <Button className="w-[50%] bg-maroon hover:bg-maroon-dark cursor-pointer">
                                Assign Truck <Truck/>
                            </Button>
                            <Button className="w-[50%] cursor-pointer"
                                variant="outline"
                                onClick={() => seteditdeviceOpen(false)}
                                >
                                Cancel
                            </Button>

                            
                        </SheetFooter>
                    </div>  

                    </SheetContent>
                </Sheet>

                <Sheet open={editdeviceopen} onOpenChange={seteditdeviceOpen}>
                    <SheetContent className="w-[420px] ">

                    <SheetHeader className="border border-transparent border-b-gray-400">
                        <SheetTitle>
                            Edit Device
                        </SheetTitle>
                        <p className="text-sm text-gray-500">Edit device data, assign truck.</p>
                    </SheetHeader>

                    <div className="space-y-5 mt-6 p-5 flex-1 overflow-auto">

                        {/* Device IMEI */}
                        <div>
                        <label className="text-sm font-medium">
                            Device IMEI
                        </label>
                        <Input
                            value={selectedDevice?.["DeviceIMEI"] || ""}
                            
                        />
                        </div>


                        {/* SIM Number */}
                        <div>
                        <label className="text-sm font-medium">
                            SIM Number
                        </label>
                        <Input
                            value={selectedDevice?.["SIM Number"] || ""}
                            
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
                            <SelectItem value="MH 12 TR 9087">
                                MH 12 TR 9087
                            </SelectItem>

                            <SelectItem value="GJ 18 TT 4433">
                                GJ 18 TT 4433
                            </SelectItem>

                            <SelectItem value="KA 51 TR 2201">
                                KA 51 TR 2201
                            </SelectItem>

                            <SelectItem value="TN 58 AB 9922">
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
                            
                        />
                        </div>


                        {/* Health Check */}
                        <div>
                        <label className="text-sm font-medium">
                            Health Check
                        </label>
                        <Input
                            value={selectedDevice?.["Health Check"] || ""}
                            
                        />
                        </div>

                    </div>


                    <div className=" border border-transparent border border-t-gray-300 bottom-2 mb-2">
                        <SheetFooter className=" flex flex-row bottom-0">

                            <Button className="w-[50%] bg-maroon hover:bg-maroon-dark cursor-pointer">
                                Edit Device  
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
    )
}