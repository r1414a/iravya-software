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
import { Textarea } from "@/components/ui/textarea"
import { BadgeAlert } from 'lucide-react';


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
        <section className="mt-6 max-w-400 mx-auto px-10">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="font-bold">Trip</TableHead>
                            <TableHead className="font-bold">Truck Number</TableHead>
                            <TableHead className="font-bold">Start and Destination</TableHead>
                            <TableHead className="font-bold">Start and End Time</TableHead>
                            <TableHead className="font-bold">Current Loacation</TableHead>
                            <TableHead className="font-bold">Driver Details</TableHead>
                            <TableHead className="font-bold">Report Problem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roadTrips.map((trips,i) => (
                            <TableRow key={i}>
                                <TableCell>{trips['trackId']}</TableCell>
                                <TableCell>{trips['truckNumber']}</TableCell>
                                <TableCell
                                    className="text-blue-600"
                                    >
                                    {trips['startingPoint'] +" - "+ trips['destinationPoint']}
                                </TableCell>
                                <TableCell className="text-green-600">{trips['startTime']+" - "+trips['endTime']}</TableCell>
                                <TableCell>{trips['currentLocation']}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <p>{trips['driverName']}</p>
                                        <p className="text-green-600">+91 {trips['contactNumber']}</p>
                                        <p className="text-blue-600">{trips['email']}</p>

                                    </div>
                                    
                                </TableCell>
                                <TableCell
                                    className="cursor-pointer "
                                    
                                    >
                                        <div>
                                            <p onClick={() => handleAssign(trips)}
                                             className="text-blue-600 hover:underline">Report Problem</p>
                                            <p>Issues: {trips['reportProblem']}</p>
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
                            Report Problem
                            <p className="text-sm text-gray-500">Make report of issues while continuing with deliveries</p>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="space-y-5 mt-6 p-5 flex-1 overflow-auto">

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
                        <div className="flex flex-col">
                            <div className="mb-2">
                                <label className="text-sm font-medium ">
                                    Problem list
                                </label>
                            </div>
                            

                            <Select>
                                <SelectTrigger>
                                <SelectValue placeholder="Select Problem" />
                                </SelectTrigger>

                                <SelectContent>
                                <SelectItem value="MH12">
                                    Not able to communicate with drives
                                </SelectItem>

                                <SelectItem value="GJ18">
                                    Low fuel
                                </SelectItem>

                                <SelectItem value="KA51">
                                    Delayed due to traffic
                                </SelectItem>

                                <SelectItem value="TN58">
                                    No issues
                                </SelectItem>
                                </SelectContent>

                            </Select>
                        </div>


                        {/* Brand */}
                        <div>
                            <label className="text-sm font-medium">
                                Add your own issue
                            </label>
                            <Textarea 
                                placeholder="Write issue"
                            />
                        </div>


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

                <div className=" border border-transparent border border-t-gray-300 bottom-2 mb-2">
                    <SheetFooter className=" flex flex-row bottom-0">

                        <Button className="w-[50%] bg-maroon hover:bg-maroon-dark cursor-pointer">
                            Report <BadgeAlert />
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