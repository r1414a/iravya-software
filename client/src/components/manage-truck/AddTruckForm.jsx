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
import {
    Plus, Truck, Upload, X, FileText, CheckCircle2,
    ShieldCheck, AlertTriangle, ExternalLink,
    Wind,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import CreateFormSheetTrigger from "../CreateFormSheetTrigger"
import { useAddTruckMutation } from "@/lib/features/trucks/truckApi"
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

// ── Mock documents (simulate uploaded files) ──────────────────────────────────
// In a real app these would come from the truck object / API
const mockDocs = {
    rc: { name: "RC_MH12AB1234.pdf", size: "318 KB", expiry: null, status: "valid" },
    insurance: { name: "Insurance_2024.pdf", size: "512 KB", expiry: "Dec 2025", status: "expiring" },
    puc: { name: "PUC_Mar2025.pdf", size: "128 KB", expiry: "Sep 2026", status: "valid" },
}

// ── Document status config ────────────────────────────────────────────────────
const docStatusConfig = {
    valid: { color: "text-green-600", bg: "bg-green-50  border-green-200", label: "Valid" },
    expiring: { color: "text-amber-600", bg: "bg-amber-50  border-amber-200", label: "Expiring soon" },
    expired: { color: "text-red-600", bg: "bg-red-50    border-red-200", label: "Expired" },
    missing: { color: "text-gray-400", bg: "bg-gray-50   border-dashed border-gray-200", label: "Not uploaded" },
}

// ── Document icons ────────────────────────────────────────────────────────────
const docIcons = {
    registration_cert: <FileText size={15} />,
    insurance_doc: <ShieldCheck size={15} />,
    PUC_cert: <Wind size={15} />,
}
const docLabels = {
    registration_cert: "RC",
    insurance_doc: "Insurance",
    PUC_cert: "PUC",
}

// ── Single document row ───────────────────────────────────────────────────────
function DocRow({ docKey, doc, onChange }) {
    const inputRef = useRef(null)
    const [replaced, setReplaced] = useState(null) // locally replaced file (not persisted)

    const cfg = docStatusConfig[doc?.status ?? "missing"]
    // const displayName = replaced?.name ?? doc?.name
    const displayName = replaced?.name ?? (typeof doc === "string" ? doc.split("/").pop() : null)
    // const displaySize = replaced ? `${(replaced.size / 1024).toFixed(0)} KB` : doc?.size
    const displaySize = replaced ? `${(replaced.size / 1024).toFixed(0)} KB` : ""

    return (
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${cfg.bg} transition-colors`}>
            {/* Icon */}
            <span className={`shrink-0 ${cfg.color}`}>
                {docIcons[docKey]}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">{docLabels[docKey]}</p>
                    {doc?.expiry && (
                        <span className={`text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${doc.status === "expiring" ? "bg-amber-100 text-amber-700"
                            : doc.status === "expired" ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-700"
                            }`}>
                            {doc.status === "expiring" ? "⚠ " : ""} Exp {doc.expiry}
                        </span>
                    )}
                </div>
                {displayName
                    ? <p className="text-[10px] sm:text-xs text-gray-500 truncate">{displayName} · {displaySize}</p>
                    : <p className="text-xs text-gray-400 italic">No file uploaded</p>
                }
            </div>

            {/* Actions */}
            <div className="flex items-center sm:gap-1 shrink-0">
                {/* View / open */}
                {doc && !replaced && (
                    <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <ExternalLink size={13} />
                    </a>
                )}

                {/* Replace / upload */}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setReplaced(file)
                        onChange?.(file)
                    }}
                />
                <button
                    onClick={() => inputRef.current?.click()}
                    className="p-1.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-colors"
                    title={displayName ? "Replace" : "Upload"}
                >
                    <Upload size={13} />
                </button>
            </div>
        </div>
    )
}

// ── Reusable single-file upload field ────────────────────────────────────────
function DocumentUpload({ label, accept = ".pdf,.jpg,.jpeg,.png", onChange }) {
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
                {/* {required
                    ?  */}
                <span className="text-red-500 ml-0.5">*</span>
                {/* : <span className="text-gray-400 font-normal ml-1">(optional)</span>
                } */}
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
                        flex flex-col items-center justify-center gap-1 px-3 py-2  rounded-md border-2 border-dashed cursor-pointer transition-colors
                        ${dragOver
                            ? "border-maroon bg-red-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                    `}
                >
                    <Upload size={16} className="text-gray-400" />
                    <p className="text-[10px] text-gray-500">
                        <span className="font-medium text-gray-700">Click to upload</span> or drag &amp; drop
                    </p>
                    <p className="text-[10px] text-gray-400">PDF, JPG, PNG</p>
                </div>
            )}
        </Field>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AddTruckModal({ truck = null, open, onClose }) {
    // const [form, setForm] = useState({
    //     regNo: truck?.regNo || "",
    //     make: truck?.make || "",
    //     type: truck?.type || "",
    //     capacity: truck?.capacity || "",
    // })

    // In real app, docs would come from truck object. Using mock here.
    const [docs, setDocs] = useState({
        registration_cert: truck?.registration_cert || null,
        insurance_doc: truck?.insurance_doc || null,
        PUC_cert: truck?.PUC_cert || null,
    })
    const [addTruck, { isLoading }] = useAddTruckMutation()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: {
            isSubmitSuccessful
        }
    } = useForm({
        defaultValues: {
            registration_no: truck?.registration_no || "",
            model: truck?.model || "",
            type: truck?.type || "",
            capacity: truck?.capacity || "",
            // licence_expiry: "",
        }
    })

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            setDocs({
                registration_cert: null,
                insurance_doc: null,
                PUC_cert: null,
            })
            onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);


    const selectedType = watch('type')


    const onSubmit = async (data) => {
        try {
            console.log(data);
            const formData = new FormData()

            formData.append("registration_no", data.registration_no.toUpperCase().trim())
            formData.append("model", data.model)
            formData.append("type", data.type)
            formData.append("capacity", data.capacity)

            if (docs.registration_cert instanceof File) {
                formData.append("registration_cert", docs.registration_cert)
            }

            if (docs.insurance_doc instanceof File) {
                formData.append("insurance_doc", docs.insurance_doc)
            }

            if (docs.PUC_cert instanceof File) {
                formData.append("PUC_cert", docs.PUC_cert)
            }

            await addTruck(formData).unwrap()
        } catch (err) {
            console.error(err)
        }
    }



    return (
        <Sheet direction="right" open={open} onOpenChange={onClose}>
            {
                truck ?
                    null
                    :
                    <CreateFormSheetTrigger text='Add Truck' />
            }


            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>{truck ? "Edit truck" : "Add a truck"}</SheetTitle>
                        <SheetDescription>
                            Register a new truck, link a GPS device, and optionally assign a driver
                        </SheetDescription>
                    </SheetHeader>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>

                                    {/* ── Truck details ── */}
                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel>Registration no.</FieldLabel>
                                            <Input
                                                {...register('registration_no')}
                                                placeholder="MH12AB1234"
                                                className="font-mono uppercase text-sm sm:text-md placeholder:text-sm" required />

                                        </Field>
                                        <Field>
                                            <FieldLabel>Make &amp; model</FieldLabel>
                                            <Input
                                                {...register('model')}
                                                className="placeholder:text-sm text-sm sm:text-md"
                                                placeholder="Tata 407" />
                                        </Field>
                                    </div>

                                    <div className="flex gap-2">
                                        <Field>
                                            <FieldLabel>Truck type</FieldLabel>
                                            <Select
                                                value={selectedType}
                                                onValueChange={(val) => setValue("type", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" className="placeholder:text-sm text-sm sm:text-md" />
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
                                            <FieldLabel>Capacity (in tons)</FieldLabel>
                                            <Input
                                                {...register('capacity')}
                                                className="placeholder:text-sm text-sm sm:text-md"
                                                placeholder="e.g. 4" />
                                        </Field>
                                    </div>

                                    {
                                        truck &&
                                        <FieldGroup className="">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="terms-checkbox-basic"
                                                name="terms-checkbox-basic"
                                            />
                                            <FieldLabel htmlFor="terms-checkbox-basic">
                                                Mark as maintenance
                                            </FieldLabel>
                                        </Field>
                                    </FieldGroup>
                                    }

                                    

                                    {/* ── Documents section ── */}
                                    {
                                        truck
                                            ?
                                            <>
                                                {/* ── Documents ── */}
                                                <div className=" border-b">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Documents</p>

                                                        {/* Warn if any doc is expiring / expired / missing */}
                                                        {Object.values(docs).some((d) => !d || ["expiring", "expired", "missing"].includes(d?.status)) && (
                                                            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                                                <AlertTriangle size={11} />
                                                                Action needed
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        {["registration_cert", "insurance_doc", "PUC_cert"].map((key) => (
                                                            <DocRow
                                                                key={key}
                                                                docKey={key}
                                                                doc={docs[key] ?? null}
                                                                onChange={(file) =>
                                                                    setDocs((prev) => ({ ...prev, [key]: file }))
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                            :
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
                                                        onChange={(f) => setDocs((d) => ({ ...d, registration_cert: f }))}
                                                    />

                                                    <Field>
                                                        <FieldLabel>Registration expiry</FieldLabel>
                                                        <Input {...register("licence_expiry")} type="date" className="text-xs" />
                                                    </Field>
                                                    <DocumentUpload
                                                        label="Insurance"
                                                        onChange={(f) => setDocs((d) => ({ ...d, insurance_doc: f }))}
                                                    />
                                                    <Field>
                                                        <FieldLabel>Insurance expiry</FieldLabel>
                                                        <Input {...register("licence_expiry")} type="date" className="text-xs" />
                                                    </Field>
                                                    <DocumentUpload
                                                        label="PUC Certificate"
                                                        onChange={(f) => setDocs((d) => ({ ...d, PUC_cert: f }))}
                                                    />
                                                    <Field>
                                                        <FieldLabel>PUC expiry</FieldLabel>
                                                        <Input {...register("licence_expiry")} type="date" className="text-xs" />
                                                    </Field>

                                                </div>
                                            </div>
                                    }






                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>


                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200">
                        <Button type="submit" disabled={isLoading} className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>{isLoading ? "Saving..." : truck ? "Save changes" : "Add Truck"} <Truck /></Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}