import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

 
export default function AlertsFilter({
    searchInput,
    setSearchInput,
    handleClear,
}) {
    const [activeRead, setActiveRead] = useState("All")
 
    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center sm:justify-between">
                    <InputGroup className="max-w-96">
                        <InputGroupInput 
                        value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search truck, driver, trip ID..." className="placeholder:text-xs lg:placeholder:text-sm"
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>

                        {searchInput && (
                            <button
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </InputGroup>
 
                {/* Right — read/unread tabs, same pattern as UsersFilter All/Active/Inactive */}
                <div className="basis-1/2 flex gap-1 sm:gap-2 justify-end">
                    {["All", "Unread", "Read"].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveRead(tab)}
                            className={`px-3 text-xs sm:text-sm ${
                                activeRead === tab
                                    ? "bg-maroon text-white"
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