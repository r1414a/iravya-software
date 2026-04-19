import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Controller } from "react-hook-form";


export default function AssignManagerSelect({name,control,errors, managers, setManagerSearch, managerSearch, loadingManagers}) {
    return (
        <>
            <Controller
                name={name}
                control={control}
                rules={{ required: "Manager is required" }}
                render={({ field }) => {
                    const [isOpen, setIsOpen] = useState(false);

                    const selectedManager = managers.find(
                        (m) => String(m.id) === String(field.value)
                    );

                    return (
                        <div className="relative">
                            {/* Input */}
                            <Input
                                placeholder="Search manager..."
                                value={
                                    selectedManager
                                        ? `${selectedManager.first_name} ${selectedManager.last_name}`
                                        : managerSearch
                                }
                                onFocus={() => setIsOpen(true)} // ✅ OPEN on focus
                                onChange={(e) => {
                                    field.onChange(""); // clear selection
                                    setManagerSearch(e.target.value);
                                    setIsOpen(true); // keep open while typing
                                }}
                                onBlur={() => {
                                    // delay so click event can fire
                                    setTimeout(() => setIsOpen(false), 200);
                                }}
                            />

                            {/* Dropdown */}
                            {isOpen && (
                                <div className="absolute z-50 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
                                    {loadingManagers ? (
                                        <p className="p-2 text-sm">Loading...</p>
                                    ) : managers.length === 0 ? (
                                        <p className="p-2 text-sm">No managers found</p>
                                    ) : (
                                        managers.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-2 cursor-pointer text-sm ${String(field.value) === String(item.id)
                                                    ? "bg-gray-200"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                                onMouseDown={() => {
                                                    // ✅ use onMouseDown instead of onClick (important)
                                                    field.onChange(item.id);
                                                    setManagerSearch("");
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {item.first_name} {item.last_name}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }}
            />

            {
                errors[name] && (
                    <p className="text-red-500 text-xs">
                        {errors[name].message}
                    </p>
                )
            }
        </>
    )
}