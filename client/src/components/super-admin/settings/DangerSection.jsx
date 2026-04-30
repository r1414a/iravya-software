import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { AlertTriangle, LogOut, MonitorX, Trash2, RefreshCw } from "lucide-react"
import { useState,useEffect } from "react"
import { z } from "zod";
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"
import { useDeleteUserMutation } from "@/lib/features/users/userApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const deleteSchema = z.object({
    confirmText: z
        .string()
        .refine((val) => val === "DELETE", {
            message: "You must type DELETE to confirm",
        }),
});

function DangerCard({ icon: Icon, title, desc, buttonLabel, onClick }) {
    return (
        <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
                <Icon size={15} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-red-700">{title}</p>
                    <p className="text-xs text-red-500 mt-0.5 leading-snug">{desc}</p>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onClick}
                className="shrink-0 text-red-600 border-red-300 hover:bg-red-100 hover:border-red-400"
            >
                {buttonLabel}
            </Button>
        </div>
    )
}


export function DangerSection() {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { user } = useSelector(selectUser);

    const [deleteUser, { isLoading }] = useDeleteUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm({
        resolver: zodResolver(deleteSchema)
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const onSubmit = async () => {
        try {
            await deleteUser(user.id).unwrap();

            // alert("Account deleted successfully");

            // optional: redirect or logout
            window.location.href = "/signin";

        } catch (err) {
            alert(err?.data?.message || "Delete failed");
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold text-red-600 flex items-center gap-2">
                    <AlertTriangle size={16} /> Danger zone
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Irreversible actions — proceed with caution</p>
            </div>


            {/* Danger action cards */}
            <div className="flex flex-col gap-4">
                <DangerCard
                    icon={Trash2}
                    title="Delete super admin account"
                    desc="Permanently deletes this super admin account. The platform remains active. You must assign another super admin first."
                    buttonLabel="Delete account"
                    onClick={() => setConfirmDelete(true)}
                />
            </div>

            {/* Inline confirm — same pattern as AddStoreForm slug confirm */}
            {confirmDelete && (
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg">
                    <p className="text-sm font-semibold text-red-700 mb-3">
                        Type <span className="font-mono bg-red-100 px-1 rounded">DELETE</span> to confirm
                    </p>
                    <div className="flex gap-3">
                        <Field className="flex-1">
                            <Input 
                            {...register("confirmText")}
                            placeholder="Type DELETE" className="border-red-300 focus-visible:ring-red-300 placeholder:text-sm text-sm sm:text-md" 
                            />
                        </Field>
                        <Button 
                            type="submit"
                            disable={isLoading} 
                            className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                        >{isLoading ? "Deleting..." : "Confirm"}</Button>
                        <Button variant="outline" 
                         onClick={() => {
                                setConfirmDelete(false);
                                reset();
                            }}
                         className="shrink-0">Cancel</Button>
                    </div>
                    {errors.confirmText && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.confirmText.message}
                        </p>
                    )}
                </form>
            )}
        </div>
    )
}