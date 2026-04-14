import { ROLES } from "@/constants/constant";
import z from "zod";

export const firstNameV = z.string().trim().min(3, "First name must be atleast 2 characters long.").max(50, "First name cannot exceed 50 characters.").regex(/^[a-zA-Z\s'-]+$/, { message: "First name contains invalid characters" });
export const lastNameV = z.string().trim().min(3, "Last name must be atleast 2 characters long.").max(50, "Last name cannot exceed 50 characters.").regex(/^[a-zA-Z\s'-]+$/, { message: "Last name contains invalid characters" });
export const emailV = z.email("Invalid email address")
export const roleV = z.enum(Object.keys(ROLES), {
    error: () => ({message: "Please select a valid role"})
})
export const phoneV = z.string().regex(/^[0-9+\-\s()]{10,15}$/, "Enter a valid phone number")
export const fullNameV = z
  .string()
  .min(2, { message: "Name is too short" })
  .max(50, { message: "Name is too long" })
  .trim() // Removes leading/trailing whitespace
  .refine((val) => val.split(" ").length >= 2, {
    message: "Please enter both your first and last name",
  });
export const addressV = z.string().min(5, "Address is required");
export const cityV = z.string().min(1, "City is required");