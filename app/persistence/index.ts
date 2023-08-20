import { User, UserRole } from "../types/user";

const seedDb: User[] = [
  {
    id: "mac",
    email: "mac@mkra.dev",
    password: "macmac",
    firstName: "Mac",
    lastName: "Mac",
    role: UserRole.ADMIN,
  },
  {
    id: "super",
    email: "super@mkra.dev",
    password: "superuser",
    firstName: "Mac",
    lastName: "Mac",
    role: UserRole.USER,
  },
];

export let UsersDB: User[] = [...seedDb];

export const invalidateUserDB = (users: User[]) => {
  UsersDB = [...users];
};
