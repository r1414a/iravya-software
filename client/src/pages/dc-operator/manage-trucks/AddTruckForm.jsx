// import { Button } from "@/components/ui/button"
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//     Field,
//     FieldDescription,
//     FieldGroup,
//     FieldLabel,
//     FieldSet,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Plus, Truck } from "lucide-react"

// export default function AddTruckModal() {

//     return (
//         <Sheet direction="right" className="">
//             <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2"><Plus className="w-4 h-4 mr-2" />
//                 Add Truck</SheetTrigger>
//             <SheetContent className="bg-white min-w-120">
//                 <SheetHeader className="border-b border-gray-200">
//                     <SheetTitle>Add a truck</SheetTitle>
//                     <SheetDescription>Register a new truck, link a GPS device, and optionally assign a driver</SheetDescription>
//                 </SheetHeader>
//                 <div className="p-4">
//                     <FieldGroup>
//                         <FieldSet>
//                             <FieldGroup>
//                                 <div className="flex gap-2">
//                                     <Field>
//                                         <FieldLabel>Registration number</FieldLabel>
//                                         <Input placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
//                                     </Field>

//                                     <Field>
//                                         <FieldLabel>Make &amp; model</FieldLabel>
//                                         <Input placeholder="e.g. Tata 407" />
//                                     </Field>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <Field>
//                                         <FieldLabel>Truck type</FieldLabel>
//                                         <Select>
//                                             <SelectTrigger>
//                                                 <SelectValue placeholder="Select type" />
//                                             </SelectTrigger>
//                                             <SelectContent className="bg-white border shadow-md">
//                                                 <SelectGroup>
//                                                     <SelectLabel>Type</SelectLabel>
//                                                     <SelectItem value="mini_truck">Mini truck</SelectItem>
//                                                     <SelectItem value="medium">Medium</SelectItem>
//                                                     <SelectItem value="heavy">Heavy</SelectItem>
//                                                 </SelectGroup>
//                                             </SelectContent>
//                                         </Select>
//                                     </Field>

//                                     <Field>
//                                         <FieldLabel>Capacity</FieldLabel>
//                                         <Input placeholder="e.g. 4T" />
//                                     </Field>
//                                 </div>

//                                 <Field>
//                                     <FieldLabel>GPS device ID <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
//                                     <Input placeholder="e.g. GPS-006-PUNE" className="font-mono" />
//                                 </Field>

//                                 <Field>
//                                     <FieldLabel>Assign driver <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
//                                     <Select>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select available driver..." />
//                                         </SelectTrigger>
//                                         <SelectContent className="bg-white border shadow-md">
//                                             <SelectGroup>
//                                                 <SelectLabel>Available drivers</SelectLabel>
//                                                 <SelectItem value="suresh_pawar">Suresh Pawar</SelectItem>
//                                                 <SelectItem value="anil_bhosale">Anil Bhosale</SelectItem>
//                                                 <SelectItem value="vijay_jadhav">Vijay Jadhav</SelectItem>
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>
//                                 </Field>
//                             </FieldGroup>
//                         </FieldSet>
//                     </FieldGroup>
//                 </div>

//                 <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
//                     <Button className='basis-1/2 bg-maroon hover:bg-maroon-dark'>Add Truck <Truck /></Button>
//                     <SheetClose className='basis-1/2' asChild>
//                         <Button className="w-full" variant="outline">Cancel</Button>
//                     </SheetClose>
//                 </SheetFooter>
//             </SheetContent>
//         </Sheet>



//         // <Dialog open={open} onOpenChange={setOpen}>
//         //     <DialogTrigger asChild>
//         //         <Button className="bg-maroon hover:bg-maroon-dark text-white flex items-center">
//         //             <Plus className="w-4 h-4 mr-1" />
//         //             Add truck
//         //         </Button>
//         //     </DialogTrigger>

//         //     <DialogContent className="bg-white max-w-md">
//         //         <DialogHeader>
//         //             <DialogTitle>Add new truck</DialogTitle>
//         //         </DialogHeader>

//         //         <div className="flex flex-col gap-4 mt-2">
//         //             {/* Registration number */}
//         //             <div className="flex flex-col gap-1.5">
//         //                 <Label>Registration number</Label>
//         //                 <Input placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
//         //             </div>

//         //             {/* Make / model */}
//         //             <div className="flex flex-col gap-1.5">
//         //                 <Label>Make &amp; model</Label>
//         //                 <Input placeholder="e.g. Tata 407" />
//         //             </div>

//         //             {/* Type + capacity — 2 col */}
//         //             <div className="grid grid-cols-2 gap-4">
//         //                 <div className="flex flex-col gap-1.5">
//         //                     <Label>Truck type</Label>
//         //                     <Select>
//         //                         <SelectTrigger>
//         //                             <SelectValue placeholder="Select type" />
//         //                         </SelectTrigger>
//         //                         <SelectContent className="bg-white border shadow-md">
//         //                             <SelectGroup>
//         //                                 <SelectLabel>Type</SelectLabel>
//         //                                 <SelectItem value="mini_truck">Mini truck</SelectItem>
//         //                                 <SelectItem value="medium">Medium</SelectItem>
//         //                                 <SelectItem value="heavy">Heavy</SelectItem>
//         //                             </SelectGroup>
//         //                         </SelectContent>
//         //                     </Select>
//         //                 </div>
//         //                 <div className="flex flex-col gap-1.5">
//         //                     <Label>Capacity</Label>
//         //                     <Input placeholder="e.g. 4T" />
//         //                 </div>
//         //             </div>

//         //             {/* GPS device ID */}
//         //             <div className="flex flex-col gap-1.5">
//         //                 <Label>GPS device ID <span className="text-gray-400 font-normal">(optional)</span></Label>
//         //                 <Input placeholder="e.g. GPS-006-PUNE" className="font-mono" />
//         //             </div>

//         //             {/* Assign driver (optional) */}
//         //             <div className="flex flex-col gap-1.5">
//         //                 <Label>Assign driver <span className="text-gray-400 font-normal">(optional)</span></Label>
//         //                 <Select>
//         //                     <SelectTrigger>
//         //                         <SelectValue placeholder="Select available driver..." />
//         //                     </SelectTrigger>
//         //                     <SelectContent className="bg-white border shadow-md">
//         //                         <SelectGroup>
//         //                             <SelectLabel>Available drivers</SelectLabel>
//         //                             <SelectItem value="suresh_pawar">Suresh Pawar</SelectItem>
//         //                             <SelectItem value="anil_bhosale">Anil Bhosale</SelectItem>
//         //                             <SelectItem value="vijay_jadhav">Vijay Jadhav</SelectItem>
//         //                         </SelectGroup>
//         //                     </SelectContent>
//         //                 </Select>
//         //             </div>

//         //             {/* Actions */}
//         //             <div className="flex justify-end gap-2 pt-2">
//         //                 <Button variant="outline" onClick={() => setOpen(false)}>
//         //                     Cancel
//         //                 </Button>
//         //                 <Button className="bg-[#701a40] text-white">
//         //                     Add truck
//         //                 </Button>
//         //             </div>
//         //         </div>
//         //     </DialogContent>
//         // </Dialog>
//     )
// }

// ─── AddTruckModal.jsx ────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Truck, Upload, X, FileText, CheckCircle2 } from "lucide-react"
import { useState, useRef } from "react"

// ── Reusable single-file upload field ────────────────────────────────────────
function DocumentUpload({ label, required = false, accept = ".pdf,.jpg,.jpeg,.png", onChange }) {
    const [file, setFile] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef(null)

    const handleFile = (f) => {
        if (!f) return
        setFile(f)
        onChange?.(f)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) handleFile(f)
    }

    const clear = (e) => {
        e.stopPropagation()
        setFile(null)
        onChange?.(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <Field>
            <FieldLabel>
                {label}
                {required
                    ? <span className="text-red-500 ml-0.5">*</span>
                    : <span className="text-gray-400 font-normal ml-1">(optional)</span>
                }
            </FieldLabel>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
                // ── Attached state ──
                <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-green-200 bg-green-50">
                    <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{file.name}</p>
                        <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                        onClick={clear}
                        className="text-green-600 hover:text-red-500 transition-colors shrink-0"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                // ── Drop zone ──
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`
                        flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-md border-2 border-dashed cursor-pointer transition-colors
                        ${dragOver
                            ? "border-maroon bg-red-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                    `}
                >
                    <Upload size={16} className="text-gray-400" />
                    <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">Click to upload</span> or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-gray-400">PDF, JPG, PNG</p>
                </div>
            )}
        </Field>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AddTruckModal() {
    const [docs, setDocs] = useState({ rc: null, insurance: null, puc: null })

    return (
        <Sheet direction="right">
            <SheetTrigger className="flex items-center bg-maroon hover:bg-maroon-dark text-white rounded-md text-sm h-8 px-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Truck
            </SheetTrigger>

            <SheetContent className="bg-white min-w-120 flex flex-col">
                <SheetHeader className="border-b border-gray-200">
                    <SheetTitle>Add a truck</SheetTitle>
                    <SheetDescription>
                        Register a new truck, link a GPS device, and optionally assign a driver
                    </SheetDescription>
                </SheetHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4">
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>

                                {/* ── Truck details ── */}
                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Registration number</FieldLabel>
                                        <Input placeholder="e.g. MH12AB1234" className="font-mono uppercase" />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Make &amp; model</FieldLabel>
                                        <Input placeholder="e.g. Tata 407" />
                                    </Field>
                                </div>

                                <div className="flex gap-2">
                                    <Field>
                                        <FieldLabel>Truck type</FieldLabel>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Type</SelectLabel>
                                                    <SelectItem value="mini_truck">Mini truck</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="heavy">Heavy</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Capacity</FieldLabel>
                                        <Input placeholder="e.g. 4T" />
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel>
                                        GPS device ID
                                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                    </FieldLabel>
                                    <Input placeholder="e.g. GPS-006-PUNE" className="font-mono" />
                                </Field>

                                <Field>
                                    <FieldLabel>
                                        Assign driver
                                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                    </FieldLabel>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select available driver..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-md">
                                            <SelectGroup>
                                                <SelectLabel>Available drivers</SelectLabel>
                                                <SelectItem value="suresh_pawar">Suresh Pawar</SelectItem>
                                                <SelectItem value="anil_bhosale">Anil Bhosale</SelectItem>
                                                <SelectItem value="vijay_jadhav">Vijay Jadhav</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* ── Documents section ── */}
                                <div className="pt-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText size={14} className="text-gray-400" />
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Vehicle documents
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <DocumentUpload
                                            label="RC (Registration Certificate)"
                                            required
                                            onChange={(f) => setDocs((d) => ({ ...d, rc: f }))}
                                        />
                                        <DocumentUpload
                                            label="Insurance"
                                            required
                                            onChange={(f) => setDocs((d) => ({ ...d, insurance: f }))}
                                        />
                                        <DocumentUpload
                                            label="PUC Certificate"
                                            onChange={(f) => setDocs((d) => ({ ...d, puc: f }))}
                                        />
                                    </div>
                                </div>

                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200">
                    <Button className="basis-1/2 bg-maroon hover:bg-maroon-dark">
                        Add Truck <Truck />
                    </Button>
                    <SheetClose className="basis-1/2" asChild>
                        <Button className="w-full" variant="outline">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}