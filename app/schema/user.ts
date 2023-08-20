import { object, string, nativeEnum } from "zod";
import { UserRole } from "../types/user";

export const userSchema = object({
  id: string(),
  email: string({ required_error: "Email is required" }).email(
    "Invalid email addresss."
  ),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be at least 8 characters.")
    .max(32, "Password must be less than 32 characters."),
  firstName: string({ required_error: "First name is required" }),
  lastName: string({ required_error: "Last name is required" }),
  role: nativeEnum(UserRole).default(UserRole.GUEST),
});

export const userCreateSchema = userSchema
  .omit({ id: true })
  .extend({
    confirmPassword: string({ required_error: "Confirm Password is required" })
      .min(6, "Password must be at least 8 characters.")
      .max(32, "Password must be less than 32 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const userLoginSchema = userSchema.pick({ email: true, password: true });

export const userUpdateSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    role: true,
  })
  .partial();

export const userChangePasswordSchema = userSchema
  .pick({ password: true })
  .extend({
    confirmPassword: string({ required_error: "Password is required" })
      .min(6, "Password must be at least 8 characters.")
      .max(32, "Password must be less than 32 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const userRequestBodySchema = object({
  body: userSchema,
});

export const userCreateBodySchema = object({
  body: userCreateSchema,
});

export const userLoginBodySchema = object({
  body: userLoginSchema,
});

export const userChangePasswordBodySchema = object({
  body: userChangePasswordSchema,
});

export const userUpdateBodySchema = object({
  body: userUpdateSchema,
});
