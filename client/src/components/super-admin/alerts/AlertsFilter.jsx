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
 
export default function AlertsFilter() {
    const [activeRead, setActiveRead] = useState("All")
 
    return (
        <section className="mt-10 px-10">
            <div className="flex w-full justify-between">
 
               
                    <InputGroup className="max-w-xs">
                        <InputGroupInput placeholder="Search truck, driver, trip ID..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
 
                {/* Right — read/unread tabs, same pattern as UsersFilter All/Active/Inactive */}
                <div className="basis-1/2 flex gap-2 justify-end">
                    {["All", "Unread", "Read"].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveRead(tab)}
                            className={`px-3 ${
                                activeRead === tab
                                    ? "bg-[#701a40] text-white"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                            }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
 
            </div>
        </section>
    )
}