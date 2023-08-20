import { TypeOf } from "zod";
import {
  userCreateSchema,
  userLoginSchema,
  userSchema,
  userUpdateSchema,
} from "../schema/user";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export type User = TypeOf<typeof userSchema>;

export type UserResponseObject = Omit<User, "password">;

export type CreateUserInput = Omit<
  TypeOf<typeof userCreateSchema>,
  "confirmPassword"
>;

export type LoginUserInput = TypeOf<typeof userLoginSchema>;

export type UpdateUserInput = TypeOf<typeof userUpdateSchema>;
