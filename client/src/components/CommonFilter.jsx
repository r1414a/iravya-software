import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"

export default function CommonFilter({
    setEditWho,
    setEditOpen,
    searchInput,
    setSearchInput,
    handleClear,
    buttonText
}) {
    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-sm order-2 sm:order-1">
                    <InputGroup >
                        <InputGroupInput
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search user by name/email..." className="placeholder:text-sm" />
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

                </div>

                <div className="flex justify-end order-1 sm:order-2">
                    <CreateFormSheetTrigger
                        text={buttonText}
                        setEditWho={setEditWho}
                        setEditOpen={setEditOpen}
                    />
                </div>
            </div>
        </section>
    )
}