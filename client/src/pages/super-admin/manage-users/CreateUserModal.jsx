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
import { Plus, UserRound, KeyRound } from "lucide-react"
import { useState, useEffect } from "react"
import CreateFormSheetTrigger from "@/components/CreateFormSheetTrigger"
import { useForm } from "react-hook-form"
import { emailV, firstNameV, lastNameV, passwordV, roleV } from "@/validations/validations"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateUserMutation, useUpdateUserMutation } from "@/lib/features/users/userApi"
import UserPassword from "./UserPassword"

const ROLE_HINT = {
    "dc_manager": "Can dispatch trips and manage trucks from their assigned DC",
    "store_manager": "Can track deliveries coming to their assigned store",
}

const getUserSchema = (isEdit) =>
    z.object({
        first_name: firstNameV,
        last_name: lastNameV,
        email: emailV,
        role: roleV,
        status: z.enum(["active", "inactive"]).default("active"),

        password: isEdit
            ? z.string().optional() // ✅ NOT required in edit
            : passwordV,            // ✅ required in create
    });
// const createUserSchema = z.object({
//     first_name: firstNameV,
//     last_name: lastNameV,
//     email: emailV,
//     role: roleV,
//     password: passwordV,
//     status: z.enum(["active", "inactive"]).default("active"),
// })

export default function CreateUserModal({ user, open, onClose }) {

    console.log(user);
    
    const [showResetConfirm, setShowResetConfirm] = useState(false)

    // const [selectedRole, setSelectedRole] = useState("dc_manager");
    const [createUser, { isLoading }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(getUserSchema(!!user)),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role: "",
            status: "active",
        },
    });

    const selectedStatus = watch('status')
    const passwordValue = watch("password");

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                password: "",
                role: user.role || "",
                status: user.user_status || "active",
            });
        } else {
            reset({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                role: "",
                status: "active",
            });
        }
    }, [user, reset]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            // onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);


    async function handleCreateUser(data) {

        console.log(data);
        try {
            if (user) {
                const { password, ...rest } = data;
                await updateUser({ id: user.id, formData: rest }).unwrap();
            } else {
                await createUser(data).unwrap();
            }
            // console.log(newUser);
            onClose(false)
        } catch (err) {
            console.error("Error while creating new user", err);

        }


    }

    const onError = (errors) => {
        console.log("FORM ERRORS:", errors);
    };
    return (
        <Sheet direction="right" open={open} onOpenChange={onClose}>
            {/* {
                user ?
                    null :
                    <CreateFormSheetTrigger text={'Create User'} />
            } */}

            <SheetContent className="w-full sm:max-w-md lg:max-w-lg bg-white p-0 flex flex-col">
                <form onSubmit={handleSubmit(handleCreateUser, onError)} className="h-full flex flex-col">
                    <SheetHeader className="border-b border-gray-200">
                        <SheetTitle>{user ? "Edit user" : "Create new user"}</SheetTitle>
                        <SheetDescription>{user ? "Update user details" : "Set role and password for created user"}</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field>
                                            <FieldLabel htmlFor="first_name">First name <span className="text-red-500">*</span></FieldLabel>
                                            <Input
                                                id="first_name"
                                                type="text"
                                                {...register("first_name")}
                                                placeholder="Rahul"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {errors.first_name && (
                                                <span className="text-red-500 text-[10px] ml-1">{errors.first_name.message}</span>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="last_name">Last name <span className="text-red-500">*</span></FieldLabel>
                                            <Input
                                                id="last_name"
                                                type="text"
                                                {...register("last_name")}
                                                placeholder="Sharma"
                                                className="placeholder:text-sm text-sm sm:text-md"
                                            />
                                            {errors.last_name && (
                                                <span className="text-red-500 text-[10px] ml-1">{errors.last_name.message}</span>
                                            )}
                                        </Field>
                                    </div>

                                    <Field>
                                        <FieldLabel htmlFor="email">Email address <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="rahul.sharma@westside.com"
                                            className="placeholder:text-sm text-sm sm:text-md"
                                        />
                                        <FieldDescription className="text-xs">
                                            Invite will be sent to this email
                                        </FieldDescription>

                                        {errors.email && (
                                            <span className="text-red-500 text-[10px] ml-1">{errors.email.message}</span>
                                        )}
                                    </Field>


                                    <Field>
                                        <FieldLabel>Role <span className="text-red-500">*</span></FieldLabel>
                                        <Select
                                            value={watch('role') || ""}
                                            onValueChange={(val) => setValue("role", val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a role..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border shadow-md">
                                                <SelectGroup>
                                                    <SelectLabel>Role</SelectLabel>
                                                    {/* <SelectItem value="Brand manager">Brand Manager</SelectItem> */}
                                                    <SelectItem value="dc_manager">DC Operator</SelectItem>
                                                    <SelectItem value="store_manager">Store Manager</SelectItem>
                                                    <SelectItem value="driver">Driver</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {watch("role") && (
                                            <FieldDescription className="text-xs">
                                                {ROLE_HINT[watch("role")]}
                                            </FieldDescription>
                                        )}

                                        {errors.role && (
                                            <span className="text-red-500 text-[10px] ml-1">{errors.role.message}</span>
                                        )}
                                    </Field>

                                    {
                                        !user && (
                                            <UserPassword
                                                register={register}
                                                errors={errors}
                                                text='Password'
                                                setValue={setValue}
                                                passwordValue={passwordValue}
                                            />
                                            // <Field>
                                            //     <FieldLabel htmlFor="password">
                                            //         Password <span className="text-red-500">*</span>
                                            //     </FieldLabel>

                                            //     <div className="flex gap-2">
                                            //         <Input
                                            //             id="password"
                                            //             type="text"
                                            //             {...register("password")}
                                            //             placeholder="Enter password"
                                            //             className="placeholder:text-sm text-sm sm:text-md"
                                            //         />
                                            //         {passwordValue && (
                                            //             <FieldDescription className="text-xs">
                                            //                 Strength:{" "}
                                            //                 <span className={
                                            //                     getPasswordStrength(passwordValue) === "Strong"
                                            //                         ? "text-green-600"
                                            //                         : getPasswordStrength(passwordValue) === "Medium"
                                            //                             ? "text-yellow-600"
                                            //                             : "text-red-600"
                                            //                 }>
                                            //                     {getPasswordStrength(passwordValue)}
                                            //                 </span>
                                            //             </FieldDescription>
                                            //         )}

                                            //         <Button
                                            //             type="button"
                                            //             // variant=""
                                            //             className="bg-maroon text-xs"
                                            //             onClick={() => {
                                            //                 const generated = generateStrongPassword();
                                            //                 setValue("password", generated);
                                            //             }}
                                            //         >
                                            //             Suggest
                                            //         </Button>
                                            //     </div>

                                            //     <p className="text-xs text-muted-foreground">Password will be send to user on above email id.</p>

                                            //     {errors.password && (
                                            //         <span className="text-red-500 text-[10px] ml-1">
                                            //             {errors.password.message}
                                            //         </span>
                                            //     )}
                                            // </Field>
                                        )
                                    }


                                    {
                                        user && (
                                            <Field>
                                                <FieldLabel>Status</FieldLabel>
                                                <Select value={selectedStatus}
                                                    onValueChange={(val) => setValue("status", val)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border shadow-md">
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FieldDescription className="text-xs">
                                                    Inactive users cannot log in or access any data until reactivated
                                                </FieldDescription>
                                            </Field>
                                        )
                                    }
                                    {/*
                                    {
                                        users && (
                                            <div className="pt-2">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                                    Account actions
                                                </p>

                                                <div className="flex flex-col items-start justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 mb-2">
                                                    <div className="w-full flex justify-between mb-2">
                                                        <div className="flex items-start gap-2">
                                                            <KeyRound size={14} className="text-gray-500 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">Reset password</p>
                                                                <p className="text-xs text-gray-400 mt-0.5 wrap-break-words">
                                                                    for {users?.email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full sm:w-auto text-xs text-red-500"
                                                            onClick={() => setShowResetConfirm(!showResetConfirm)}
                                                        >
                                                            {showResetConfirm ? 'Close' : 'Reset'}
                                                        </Button>

                                                    </div>

                                                    {showResetConfirm && (
                                                        <UserPassword
                                                            isEdit={!!users}
                                                            register={register}
                                                            errors={errors}
                                                            text='Create new password'
                                                            setValue={setValue}
                                                            passwordValue={passwordValue}
                                                        />
                                                    )}
                                                </div>

                                            </div>
                                        )
                                    } */}



                                    {/* Scope — only shown for dc_manager and Store manager */}
                                    {/* {(watch("role") === "dc_manager" || watch("role") === "store_manager") && (
                                            <Field>
                                                <FieldLabel>
                                                    {watch("role") === "dc_manager" ? "Assigned DC" : "Assigned store"} <span className="text-red-500">*</span>
                                                </FieldLabel>
                                                <Select
                                                    value={watch("scope") || ""}
                                                    onValueChange={(val) => setValue("scope", val)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={`Select ${watch("role") === "dc_manager" ? "data center" : "store"}...`} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border shadow-md">
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                {watch("role") === "dc_manager" ? "Data Centers" : "Stores"}
                                                            </SelectLabel>
                                                            {(SCOPE_OPTIONS[watch("role")] ?? []).map((opt) => (
                                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FieldDescription className="text-xs">
                                                    {watch("role") === "dc_manager"
                                                        ? "User will only see trucks and trips from this DC"
                                                        : "User will only see deliveries coming to this store"}
                                                </FieldDescription>
                                            </Field>
                                        )} */}

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>

                    </div>


                    <SheetFooter className="flex flex-col sm:flex-row gap-2 items-center w-full border-t border-gray-200 p-4">
                        <Button type="submit" disabled={isLoading} className='w-full sm:w-1/2 bg-maroon hover:bg-maroon-dark'>
                            {
                                user
                                    ? (isUpdating ? "Updating..." : "Update User")
                                    : (isLoading ? "Adding..." : "Create User")
                            }

                            <UserRound />
                        </Button>
                        <SheetClose className='basis-1/2' asChild>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}