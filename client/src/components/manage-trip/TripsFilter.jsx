import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useLocation } from "react-router-dom"

export default function TripsFilter() {
    const [activeStatus, setActiveStatus] = useState("All")
    const location = useLocation()

    const statusTabs = ["All", "In Transit", "Completed", "Scheduled", "Cancelled"]

    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">

                {/* Left — search + dropdowns */}
                <div className="basis-1/2 flex gap-4">
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search trip ID, truck, driver..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>

                    {/* <div className="flex gap-4 w-full"> */}
                    {
                        location.pathname.startsWith("/admin") && (
                            <Select defaultValue="all_dcs">
                            <SelectTrigger className="w-56">
                                <SelectValue placeholder="Select DC..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                                <SelectGroup>
                                    <SelectLabel>Data Centers</SelectLabel>
                                    <SelectItem value="all_dcs">All DCs</SelectItem>
                                    <SelectItem value="pune_dc">Pune Warehouse DC</SelectItem>
                                    <SelectItem value="mumbai_dc">Mumbai Warehouse DC</SelectItem>
                                    <SelectItem value="nashik_dc">Nashik DC</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        )
                    }
                        
                    {/* </div> */}
                </div>

                {/* Right — status tabs */}
                {/* <div className="basis-1/2 flex gap-2 justify-end">
                    {statusTabs.map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveStatus(tab)}
                            className={`px-3 text-xs ${
                                activeStatus === tab
                                    ? "bg-[#701a40] text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                            }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div> */}

            </div>
        </section>
    )
}