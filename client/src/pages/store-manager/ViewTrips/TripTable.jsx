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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const roadTrips = [
  {
    trackId: "TRK001",
    truckNumber: "MH 12 TR 9087",
    startingPoint: "Mumbai",
    destinationPoint: "Pune",
    startTime: "2026-03-26 08:00 AM",
    endTime: "2026-03-26 02:00 PM",
    driverName: "Ramesh Patil",
    contactNumber: "9876543210",
    email: "ramesh.patil@gmail.com",
    currentLocation: "Lonavala",
    reportProblem: "No Issues"
  },
  {
    trackId: "TRK002",
    truckNumber: "GJ 18 TT 4433",
    startingPoint: "Ahmedabad",
    destinationPoint: "Surat",
    startTime: "2026-03-26 07:30 AM",
    endTime: "2026-03-26 01:00 PM",
    driverName: "Mahesh Yadav",
    contactNumber: "9876543211",
    email: "mahesh.yadav@gmail.com",
    currentLocation: "Vadodara",
    reportProblem: "Delayed due to traffic"
  },
  {
    trackId: "TRK003",
    truckNumber: "KA 51 TR 2201",
    startingPoint: "Bangalore",
    destinationPoint: "Chennai",
    startTime: "2026-03-26 06:00 AM",
    endTime: "2026-03-26 03:00 PM",
    driverName: "Suresh Kumar",
    contactNumber: "9876543212",
    email: "suresh.kumar@gmail.com",
    currentLocation: "Hosur",
    reportProblem: "No Issues"
  },
  {
    trackId: "TRK004",
    truckNumber: "TN 58 AB 9922",
    startingPoint: "Chennai",
    destinationPoint: "Hyderabad",
    startTime: "2026-03-26 09:00 AM",
    endTime: "2026-03-26 08:00 PM",
    driverName: "Rajesh Kumar",
    contactNumber: "9876543213",
    email: "rajesh.kumar@gmail.com",
    currentLocation: "Nellore",
    reportProblem: "Fuel low"
  },
  {
    trackId: "TRK005",
    truckNumber: "RJ 14 TR 7788",
    startingPoint: "Jaipur",
    destinationPoint: "Delhi",
    startTime: "2026-03-26 05:30 AM",
    endTime: "2026-03-26 12:30 PM",
    driverName: "Vikram Singh",
    contactNumber: "9876543214",
    email: "vikram.singh@gmail.com",
    currentLocation: "Gurgaon",
    reportProblem: "No Issues"
  },
  {
    trackId: "TRK006",
    truckNumber: "UP 32 TT 5544",
    startingPoint: "Lucknow",
    destinationPoint: "Kanpur",
    startTime: "2026-03-26 10:00 AM",
    endTime: "2026-03-26 02:00 PM",
    driverName: "Amit Verma",
    contactNumber: "9876543215",
    email: "amit.verma@gmail.com",
    currentLocation: "Unnao",
    reportProblem: "Tyre Check Required"
  }
];

export default function TripTable (){
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
                            <TableHead>Trip</TableHead>
                            <TableHead>Truck Number</TableHead>
                            <TableHead>Start and Destination</TableHead>
                            <TableHead>Start and End Time</TableHead>
                            <TableHead>Current Loacation</TableHead>
                            <TableHead>Driver Details</TableHead>
                            <TableHead>Report Problem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roadTrips.map((trips,i) => (
                            <TableRow key={i}>
                                <TableCell>{trips['trackId']}</TableCell>
                                <TableCell>{trips['truckNumber']}</TableCell>
                                <TableCell
                                    
                                    >
                                    {trips['startingPoint'] +"-"+ trips['destinationPoint']}
                                </TableCell>
                                <TableCell>{trips['startTime']+"-"+trips['endTime']}</TableCell>
                                <TableCell>{trips['currentLocation']}</TableCell>
                                <TableCell>{trips['driverName']}</TableCell>
                                <TableCell
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => handleAssign(trips)}
                                    >{trips['reportProblem']}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            {/* RIGHT SIDE FORM */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className="w-[420px]">

                    <SheetHeader>
                        <SheetTitle>Report Problem</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-5 mt-6">

                        {/* Device IMEI */}
                        {/* <div>
                            <label className="text-sm font-medium">
                                Device IMEI
                            </label>
                            <Input
                                value={selectedDevice?.["Device IMEI"] || ""}
                                disabled
                            />
                        </div> */}


                        {/* SIM Number */}
                        {/* <div>
                            <label className="text-sm font-medium">
                                SIM Number
                            </label>
                            <Input
                                value={selectedDevice?.["SIM Number"] || ""}
                                disabled
                            />
                        </div> */}


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
                        {/* <div>
                            <label className="text-sm font-medium">
                                Brand
                            </label>
                            <Input
                                value={selectedDevice?.Brand || ""}
                                disabled
                            />
                        </div> */}


                        {/* Health Check */}
                        {/* <div>
                            <label className="text-sm font-medium">
                                Health Check
                            </label>
                            <Input
                                value={selectedDevice?.["Health Check"] || ""}
                                disabled
                            />
                        </div> */}

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