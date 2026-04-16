import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import UserPassword from "./UserPassword"
import { passwordV } from "@/validations/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { useEffect } from "react";
import { useSetUserPasswordMutation } from "@/lib/features/users/userApi";

const resetPasswordSchema = z.object({
    password: passwordV
})

export default function EditPasswordModal({ user, open, onClose }) {

    const [setUserPassword, { isLoading }] = useSetUserPasswordMutation();


    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: ""
        },
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
            onClose?.(false)
        }
    }, [isSubmitSuccessful, reset]);

    const passwordValue = watch("password");

    async function onSubmit(data) {
        console.log(data);
        try {
            await setUserPassword({
                id: user.id,
                password: data.password
            }).unwrap();
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Reset password</DialogTitle>
                    <DialogDescription>for {user?.email}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="pt-2">

                    <UserPassword
                        isEdit={!!user}
                        register={register}
                        errors={errors}
                        text='Create new password'
                        setValue={setValue}
                        passwordValue={passwordValue}
                    />

                    <Button type="submit" className="mt-3 bg-maroon text-xs"><KeyRound />{isLoading ? 'Resetting...' : 'Reset password'}</Button>

                </form>
            </DialogContent>
        </Dialog>
    )
}