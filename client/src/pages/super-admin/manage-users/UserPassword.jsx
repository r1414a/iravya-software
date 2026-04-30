import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { generateStrongPassword, getPasswordStrength } from "@/lib/utils/helperFunctions";


export default function UserPassword({ isEdit, register, errors, setValue, text, passwordValue }) {
    return (
        <Field>
            <FieldLabel htmlFor="password" className={`${isEdit ? 'text-xs text-gray-700' : ''}`}>
                {text} <span className="text-red-500">*</span>
            </FieldLabel>

            <div className="flex gap-2">
                <Input
                    id="password"
                    type="text"
                    {...register("password")}
                    placeholder="Enter password"
                    className="placeholder:text-sm text-sm sm:text-md"
                />
                {passwordValue && (
                    <FieldDescription className="text-xs">
                        Strength:{" "}
                        <span className={
                            getPasswordStrength(passwordValue) === "Strong"
                                ? "text-green-600"
                                : getPasswordStrength(passwordValue) === "Medium"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                        }>
                            {getPasswordStrength(passwordValue)}
                        </span>
                    </FieldDescription>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-100 text-xs"
                    onClick={() => {
                        const generated = generateStrongPassword();
                        setValue("password", generated);
                    }}
                >
                    Suggest
                </Button>
            </div>

            <p className="text-xs text-muted-foreground">Password will be send to user on above email id.</p>

            {errors.password && (
                <span className="text-red-500 text-[10px] ml-1">
                    {errors.password.message}
                </span>
            )}
        </Field>
    )
}