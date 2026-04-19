// AddTruckModal.jsx (Complete & Fixed)
import { useEffect, useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Field,
    FieldDescription,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
    Truck,
    Upload,
    FileText,
    ShieldCheck,
    AlertTriangle,
    ExternalLink,
    Wind,
    Wrench,
} from "lucide-react"
import CreateFormSheetTrigger from "../CreateFormSheetTrigger"
import { useAddTruckMutation, useUpdateTruckMutation } from "@/lib/features/trucks/truckApi"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"

// ─── Validation Schema ───────────────────────────────────────────────────────
const TRUCK_SCHEMA = z.object({
    registration_no: z.string()
        .min(6, "Registration number must be at least 6 characters")
        .max(15, "Registration number is too long")
        .regex(/^[A-Z0-9]+$/, "Only uppercase letters and numbers allowed"),
    model: z.string().min(2, "Model is required").max(50, "Model name is too long"),
    type: z.enum(["mini_truck", "medium", "heavy"], {
        required_error: "Truck type is required"
    }),
    capacity: z.string().min(1, "Capacity is required"),
    rc_expiry: z.string().optional(),
    insurance_expiry: z.string().optional(),
    puc_expiry: z.string().optional(),
    truck_status: z.enum(["idle", "maintenance", "in_transit"]).optional(),
})

const TRUCK_TYPES = [
    { value: "mini_truck", label: "Mini truck" },
    { value: "medium", label: "Medium" },
    { value: "heavy", label: "Heavy" },
]

// ─── Helper Functions ────────────────────────────────────────────────────────
const formatDisplayExpiry = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

const getDocStatus = (expiry) => {
    if (!expiry) return "missing"

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expDate = new Date(expiry)
    expDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "expired"
    if (diffDays <= 30) return "expiring"
    return "valid"
}

const createFileDocObject = (file, expiry = "") => {
    if (!file) return null

    return {
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        file,
        url: URL.createObjectURL(file),
        expiry: formatDisplayExpiry(expiry),
        rawExpiry: expiry,
        status: getDocStatus(expiry),
    }
}

const createExistingDocObject = (url, expiry = "", docStatus = "") => {
    if (!url) return null

    return {
        name: url.split("/").pop() || "Document.pdf",
        size: "—",
        url,
        expiry: formatDisplayExpiry(expiry),
        rawExpiry: expiry || "",
        status: docStatus || getDocStatus(expiry),
        file: null,
    }
}

// ─── Document Status Config ──────────────────────────────────────────────────
const DOC_STATUS_CONFIG = {
    valid: {
        color: "text-green-600",
        bg: "bg-green-50 border-green-200",
        label: "Valid",
    },
    expiring: {
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200",
        label: "Expiring soon",
    },
    expired: {
        color: "text-red-600",
        bg: "bg-red-50 border-red-200",
        label: "Expired",
    },
    missing: {
        color: "text-gray-400",
        bg: "bg-gray-50 border-dashed border-gray-200",
        label: "Not uploaded",
    },
}

const DOC_ICONS = {
    registration_cert: <FileText size={15} />,
    insurance_doc: <ShieldCheck size={15} />,
    PUC_cert: <Wind size={15} />,
}

const DOC_LABELS = {
    registration_cert: "RC",
    insurance_doc: "Insurance",
    PUC_cert: "PUC",
}

// ─── Document Row Component ──────────────────────────────────────────────────
function DocRow({ docKey, doc, onChange }) {
    const inputRef = useRef(null)

    const normalizedDoc = doc?.file instanceof File
        ? {
            name: doc.file.name,
            size: `${(doc.file.size / 1024).toFixed(0)} KB`,
            status: doc.status || "valid",
            expiry: doc.expiry,
            url: doc.url,
        }
        : doc && typeof doc === "object"
            ? doc
            : null

    const cfg = DOC_STATUS_CONFIG[normalizedDoc?.status ?? "missing"]
    const displayName = normalizedDoc?.name ?? null
    const displaySize = normalizedDoc?.size ?? ""

    return (
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${cfg.bg} transition-colors`}>
            <span className={`shrink-0 ${cfg.color}`}>
                {DOC_ICONS[docKey]}
            </span>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                        {DOC_LABELS[docKey]}
                    </p>

                    {normalizedDoc?.expiry && (
                        <span className={`text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            normalizedDoc.status === "expiring"
                                ? "bg-amber-100 text-amber-700"
                                : normalizedDoc.status === "expired"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-700"
                        }`}>
                            {normalizedDoc.status === "expiring" ? "⚠ " : ""}
                            Exp {normalizedDoc.expiry}
                        </span>
                    )}
                </div>

                {displayName ? (
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {displayName} {displaySize && displaySize !== "—" ? `· ${displaySize}` : ""}
                    </p>
                ) : (
                    <p className="text-xs text-gray-400 italic">
                        No file uploaded
                    </p>
                )}
            </div>

            <div className="flex items-center sm:gap-1 shrink-0">
                {normalizedDoc?.url && (
                    <a
                        href={normalizedDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-white/60 text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={13} />
                    </a>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        onChange?.(file)
                    }}
                />

                <button
                    type="button"
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AddTruckModal({
    truck = null,
    open,
    onClose,
}) {
    const isEdit = !!truck

    const {user} = useSelector(selectUser);
         const isadmin = user.role === 'super_admin'

    const [addTruck, { isLoading }] = useAddTruckMutation()
    const [updateTruck, { isLoading: isUpdating }] = useUpdateTruckMutation()

    const getInitialDocs = (truckData = null) => {
        if (!truckData) {
            return {
                registration_cert: null,
                insurance_doc: null,
                PUC_cert: null,
            }
        }

        // Parse truck documents from API response
        const docs = {}
        
        if (truckData.documents && Array.isArray(truckData.documents)) {
            truckData.documents.forEach(doc => {
                docs[doc.doc_type] = createExistingDocObject(
                    doc.file_url,
                    doc.expiry_date,
                    doc.document_status
                )
            })
        }

        return {
            registration_cert: docs.registration_cert || null,
            insurance_doc: docs.insurance_doc || null,
            PUC_cert: docs.PUC_cert || null,
        }
    }

    const [docs, setDocs] = useState(getInitialDocs(truck))

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(TRUCK_SCHEMA),
        defaultValues: {
            registration_no: "",
            model: "",
            type: "",
            capacity: "",
            rc_expiry: "",
            insurance_expiry: "",
            puc_expiry: "",
            truck_status: "idle",
        },
    })

    const selectedType = watch("type")
    const rcExpiry = watch("rc_expiry")
    const insuranceExpiry = watch("insurance_expiry")
    const pucExpiry = watch("puc_expiry")
    const truckStatus = watch("truck_status")

    // Pre-fill form when editing
    useEffect(() => {
        if (truck && open) {
            const rcDoc = truck.documents?.find(d => d.doc_type === "registration_cert")
            const insDoc = truck.documents?.find(d => d.doc_type === "insurance_doc")
            const pucDoc = truck.documents?.find(d => d.doc_type === "PUC_cert")

            reset({
                registration_no: truck.registration_no || "",
                model: truck.model || "",
                type: truck.type || "",
                capacity: truck.capacity || "",
                truck_status: truck.status || "idle",
                rc_expiry: rcDoc?.expiry_date || "",
                insurance_expiry: insDoc?.expiry_date || "",
                puc_expiry: pucDoc?.expiry_date || "",
            })

            setDocs(getInitialDocs(truck))
        } else {
            reset({
                registration_no: "",
                model: "",
                type: "",
                capacity: "",
                rc_expiry: "",
                insurance_expiry: "",
                puc_expiry: "",
                truck_status: "idle",
            })

            setDocs({
                registration_cert: null,
                insurance_doc: null,
                PUC_cert: null,
            })
        }
    }, [truck, open, reset])

    // Update doc status when expiry changes
    useEffect(() => {
        setDocs((prev) => ({
            ...prev,
            registration_cert: prev.registration_cert
                ? {
                    ...prev.registration_cert,
                    expiry: formatDisplayExpiry(rcExpiry),
                    rawExpiry: rcExpiry,
                    status: getDocStatus(rcExpiry),
                }
                : prev.registration_cert,
            insurance_doc: prev.insurance_doc
                ? {
                    ...prev.insurance_doc,
                    expiry: formatDisplayExpiry(insuranceExpiry),
                    rawExpiry: insuranceExpiry,
                    status: getDocStatus(insuranceExpiry),
                }
                : prev.insurance_doc,
            PUC_cert: prev.PUC_cert
                ? {
                    ...prev.PUC_cert,
                    expiry: formatDisplayExpiry(pucExpiry),
                    rawExpiry: pucExpiry,
                    status: getDocStatus(pucExpiry),
                }
                : prev.PUC_cert,
        }))
    }, [rcExpiry, insuranceExpiry, pucExpiry])

    const handleDocChange = (key, file, expiry) => {
        setDocs((prev) => ({
            ...prev,
            [key]: file ? createFileDocObject(file, expiry) : prev[key],
        }))
    }

    const onSubmit = async (data) => {
        try {
            const formData = new FormData()

            formData.append("registration_no", data.registration_no.toUpperCase().trim())
            formData.append("model", data.model)
            formData.append("type", data.type)
            formData.append("capacity", data.capacity)
            formData.append("rc_expiry", data.rc_expiry || "")
            formData.append("insurance_expiry", data.insurance_expiry || "")
            formData.append("puc_expiry", data.puc_expiry || "")

            if (isEdit) {
                formData.append("truck_status", data.truck_status)
            }

            // Append document files if they are new uploads (File objects)
            if (docs.registration_cert?.file instanceof File) {
                formData.append("registration_cert", docs.registration_cert.file)
            }

            if (docs.insurance_doc?.file instanceof File) {
                formData.append("insurance_doc", docs.insurance_doc.file)
            }

            if (docs.PUC_cert?.file instanceof File) {
                formData.append("PUC_cert", docs.PUC_cert.file)
            }

            if (isEdit) {
                await updateTruck({ id: truck.id, formData }).unwrap()
                
                // toast.success("Truck updated successfully", {
                //     description: `${data.registration_no} has been updated.`,
                // })
            } else {
                await addTruck(formData).unwrap()
                
                // toast.success("Truck added successfully", {
                //     description: `${data.registration_no} has been created.`,
                // })

                reset()
                setDocs({
                    registration_cert: null,
                    insurance_doc: null,
                    PUC_cert: null,
                })
            }

            onClose?.(false)
        } catch (err) {
            // toast.error(isEdit ? "Failed to update truck" : "Failed to add truck", {
            //     description: err?.data?.message || "Please try again",
            // })
            console.error(isEdit ? "Failed to update truck" : "Failed to add truck",err)
        }
    }

    const isMaintenance = truckStatus === "maintenance"

    return (
        <Sheet open={open} onOpenChange={onClose}>
            {/* {!isEdit && <CreateFormSheetTrigger text="Add Truck" />} */}

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200 px-4 sm:px-6 pt-5 pb-4">
                        <SheetTitle>
                            {isEdit ? "Edit truck" : "Add a truck"}
                        </SheetTitle>
                        <SheetDescription>
                            {isEdit
                                ? "Update truck details and documents"
                                : "Register a new truck with all required details"}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-3 pb-3 sm:px-6 sm:py-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>
                                                Registration no. <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...register("registration_no")}
                                                placeholder="MH12AB1234"
                                                className="font-mono uppercase text-sm sm:text-md placeholder:text-sm"
                                            />
                                            {errors.registration_no && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.registration_no.message}
                                                </p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel>
                                                Make &amp; model <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...register("model")}
                                                className="placeholder:text-sm text-sm sm:text-md"
                                                placeholder="Tata 407"
                                            />
                                            {errors.model && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.model.message}
                                                </p>
                                            )}
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel>
                                                Truck type <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Controller
                                                name="type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white border shadow-md">
                                                            <SelectGroup>
                                                                <SelectLabel>Type</SelectLabel>
                                                                {TRUCK_TYPES.map(type => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.type && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.type.message}
                                                </p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel>
                                                Capacity (tons) <span className="text-red-500">*</span>
                                            </FieldLabel>
                                            <Input
                                                {...register("capacity")}
                                                className="placeholder:text-sm text-sm sm:text-md"
                                                placeholder="e.g. 4"
                                            />
                                            {errors.capacity && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.capacity.message}
                                                </p>
                                            )}
                                        </Field>
                                    </div>

                                    {/* Documents Section */}
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-gray-400" />
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Vehicle documents
                                                </p>
                                            </div>

                                            {isEdit && Object.values(docs).some(
                                                (d) => !d || ["expiring", "expired"].includes(d?.status)
                                            ) && (
                                                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                                    <AlertTriangle size={11} />
                                                    Action needed
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {/* RC */}
                                            <div className="space-y-2">
                                                <DocRow
                                                    docKey="registration_cert"
                                                    doc={docs.registration_cert}
                                                    onChange={(file) =>
                                                        handleDocChange("registration_cert", file, rcExpiry)
                                                    }
                                                />
                                                <Field>
                                                    <FieldLabel>Registration expiry</FieldLabel>
                                                    <Input
                                                        {...register("rc_expiry")}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        type="date"
                                                        className="text-xs"
                                                    />
                                                </Field>
                                            </div>

                                            {/* Insurance */}
                                            <div className="space-y-2">
                                                <DocRow
                                                    docKey="insurance_doc"
                                                    doc={docs.insurance_doc}
                                                    onChange={(file) =>
                                                        handleDocChange("insurance_doc", file, insuranceExpiry)
                                                    }
                                                />
                                                <Field>
                                                    <FieldLabel>Insurance expiry</FieldLabel>
                                                    <Input
                                                        {...register("insurance_expiry")}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        type="date"
                                                        className="text-xs"
                                                    />
                                                </Field>
                                            </div>

                                            {/* PUC */}
                                            <div className="space-y-2">
                                                <DocRow
                                                    docKey="PUC_cert"
                                                    doc={docs.PUC_cert}
                                                    onChange={(file) =>
                                                        handleDocChange("PUC_cert", file, pucExpiry)
                                                    }
                                                />
                                                <Field>
                                                    <FieldLabel>PUC expiry</FieldLabel>
                                                    <Input
                                                        {...register("puc_expiry")}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        type="date"
                                                        className="text-xs"
                                                    />
                                                </Field>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Maintenance Checkbox */}
                                    {isEdit && isadmin && (
                                        <Field orientation="horizontal">
                                            <Controller
                                                name="truck_status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id="maintenance-checkbox"
                                                        checked={field.value === "maintenance"}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(checked ? "maintenance" : "idle")
                                                        }
                                                        className="border border-gray-500"
                                                    />
                                                )}
                                            />
                                            <FieldLabel htmlFor="maintenance-checkbox" className="font-bold">
                                                Mark as maintenance <Wrench size={14} />
                                            </FieldLabel>
                                        </Field>
                                    )}
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200 px-4 sm:px-6 py-4">
                        <Button
                            type="submit"
                            disabled={isLoading || isUpdating}
                            className="w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark"
                        >
                            {isEdit
                                ? (isUpdating ? "Updating..." : "Save changes")
                                : (isLoading ? "Adding..." : "Add Truck")}
                            <Truck className="ml-2" />
                        </Button>

                        <SheetClose className="w-full sm:w-1/2" asChild>
                            <Button variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}