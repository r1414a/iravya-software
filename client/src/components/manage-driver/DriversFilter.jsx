import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"

export default function DriversFilter({ CreateButton }) {
    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-sm">
                    <InputGroup>
                        <InputGroupInput placeholder="Search drivers by name or mobile number..." className="placeholder:text-xs lg:placeholder:text-sm" />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>

                </div>
                {CreateButton && (
                    <div className="w-full sm:w-auto flex justify-end">
                        {CreateButton}
                    </div>
                )}
            </div>
        </section>
    )
}