import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Camera } from "lucide-react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { emailV, firstNameV, lastNameV, phoneV } from "@/validations/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"

const profileSchema = z.object({
    first_name: firstNameV,
    last_name: lastNameV,
    email: emailV,
    phone_number: phoneV
})
 
export function ProfileSection() {
    const {user} = useSelector(selectUser)
    const {
            register,
            handleSubmit,
            reset,
            control,
            setValue,
            watch,
            formState: { errors, isSubmitSuccessful },
        } = useForm({
            resolver: zodResolver(profileSchema),
            defaultValues: {
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
            }
        })

    const onSubmit = async(data) => {
        try{
            console.log(data);
            
        }catch (err) {
            console.error(err)
        }
    }
 
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold">Profile</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update your personal details and profile photo</p>
            </div>
 
            {/* Avatar upload */}
            <div className="flex gap-5 mb-4 pb-4 sm:mb-8 sm:pb-8 border-b border-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gold flex items-center justify-center text-white text-2xl font-bold select-none">
                        SA
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-sm font-medium">Super Admin</p>
                    <p className="text-xs text-gray-400 mt-0.5">admin@fleettrack.in</p>
                </div>
            </div>
 
            {/* Form — same FieldGroup/FieldSet/Field pattern as AddDCForm */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldGroup>
                        <div className="flex gap-3">
                            <Field>
                                <FieldLabel>First name</FieldLabel>
                                <Input 
                                    {...register("first_name")}
                                    placeholder="First name" 
                                    className="placeholder:text-sm text-sm sm:text-md"
                                />
                                {errors.first_name && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.first_name.message}</p>
                                            )}
                            </Field>
                            <Field>
                                <FieldLabel>Last name</FieldLabel>
                                <Input 
                                    {...register("last_name")}
                                    placeholder="Last name" 
                                    className="placeholder:text-sm text-sm sm:text-md"
                                />
                                {errors.last_name && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.last_name.message}</p>
                                            )}
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel>Email address</FieldLabel>
                            <Input 
                                type="email" 
                                {...register("email")}
                                className="placeholder:text-sm text-sm sm:text-md"
                                />
                                 {errors.email && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.email.message}</p>
                                            )}
                            <FieldDescription className="text-xs">Used to log in to the platform</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel>Phone number</FieldLabel>
                            <Input type="tel" 
                                {...register("phone_number")} 
                                placeholder="+91 XXXXX XXXXX" className="placeholder:text-sm text-sm sm:text-md"/>
                                 {errors.phone_number && (
                                                <p className="text-red-500 text-[10px] ml-1">{errors.phone_number.message}</p>
                                            )}
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
 
            <div className="mt-6">
                <Button type="submit" className="w-full sm:w-fit bg-maroon hover:bg-maroon-dark text-white">Save profile</Button>
            </div>
            </form>
        </div>
    )
}