import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { z } from "zod";
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"
import { useChangePasswordMutation } from "@/lib/features/auth/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const passwordSchema = z.object({
    old_pass: z.string().min(1, "Current password is required"),

    new_pass: z
        .string()
        .min(8, "Minimum 8 characters")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[0-9]/, "At least one number")
        .regex(/[^A-Za-z0-9]/, "At least one special character"),

    confirm_pass: z.string()
}).refine((data) => data.new_pass === data.confirm_pass, {
    message: "Passwords do not match",
    path: ["confirm_pass"]
});


function PasswordInput({ label, description, placeholder, register, errors, fieldName }) {
    const [show, setShow] = useState(false)
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <Input 
                    type={show ? "text" : "password"} 
                    placeholder={placeholder} 
                    className="pr-10 placeholder:text-sm text-sm sm:text-md" 
                    {...register(`${fieldName}`)} 
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            {description && <FieldDescription className="text-xs">{description}</FieldDescription>}

             <p className="text-red-500 text-xs">{errors[fieldName]?.message}</p>
        </Field>
    )
}

export function PasswordSection() {
    const { user } = useSelector(selectUser);
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    useEffect(() => {
            if (isSubmitSuccessful) {
                reset();
            }
        }, [isSubmitSuccessful, reset]);


    const onSubmit = async (data) => {
        try {

            console.log(data);
            
            await changePassword({
                id: user.id,
                old_pass: data.old_pass,
                new_pass: data.new_pass
            }).unwrap();

            // alert("Password updated successfully");
        } catch (err) {
            console.error(err?.data?.message || "Something went wrong");
        }
    };

    const onError = (err) => {
        console.log(err);
        
    }


    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold">Change password</h2>
                <p className="text-sm text-gray-500 mt-0.5">Keep your account secure with a strong password</p>
            </div>

            {/* Requirements card — same bg-gray-50 border border-gray-100 rounded-lg style */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-maroon" />
                    <p className="text-xs font-semibold text-gray-600">Password requirements</p>
                </div>
                <ul className="flex flex-col gap-1">
                    {["Minimum 8 characters", "At least one uppercase letter", "At least one number", "At least one special character"].map(r => (
                        <li key={r} className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />{r}
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <FieldGroup>
                    <FieldSet>
                        <FieldGroup>
                            <PasswordInput label="Current password" placeholder="Enter current password" register={register} errors={errors} fieldName={'old_pass'}/>
                            <PasswordInput label="New password" placeholder="Enter new password" description="Must meet the requirements above" register={register} errors={errors} fieldName={'new_pass'}/>
                            <PasswordInput label="Confirm new password" placeholder="Re-enter new password" register={register} errors={errors} fieldName={'confirm_pass'}/>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>

                <div className="mt-6">
                    <Button type="submit" disabled={isLoading} className="bg-maroon hover:bg-maroon-dark text-white">{isLoading ? "Updating..." : "Update password"}</Button>
                </div>

            </form>
        </div>
    )
}