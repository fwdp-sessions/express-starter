import { v4 as uuidv4 } from "uuid";
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserResponseObject,
} from "../types/user";
import { UsersDB, invalidateUserDB } from "../persistence";
import { signJwt } from "../utils/jwt";
import config from "config";

export const UserResponseBuilder = (user: User): UserResponseObject => {
  const { id, email, firstName, lastName, role } = user;
  return {
    id,
    email,
    firstName,
    lastName,
    role,
  };
};

export const signTokens = async (user: UserResponseObject) => {
  const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  console.log(accessToken);

  const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  console.log(refreshToken);

  return { accessToken, refreshToken };
};

export const findUser = async (id: string): Promise<User> => {
  try {
    const userFound = UsersDB.find((user) => user.id === id);
    if (userFound !== undefined) return userFound;
    throw new Error("User not found");
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const findUserById = async (
  id: string
): Promise<UserResponseObject | undefined> => {
  try {
    const userFound = UsersDB.find((user) => user.id === id);
    if (userFound !== undefined) return UserResponseBuilder(userFound);
    return undefined;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const findUserByEmail = async (
  email: string
): Promise<UserResponseObject | undefined> => {
  try {
    const userFound = UsersDB.find((user) => user.email === email);
    if (userFound !== undefined) return UserResponseBuilder(userFound);
    return undefined;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const createUser = async (
  input: CreateUserInput
): Promise<UserResponseObject> => {
  const { email, password, firstName, lastName, role } = input;
  try {
    const findUser = await findUserByEmail(email);
    if (findUser) throw new Error("Email already exists");
    const newUser: User = {
      id: uuidv4(),
      email,
      password,
      firstName,
      lastName,
      role,
    };
    UsersDB.push(newUser);
    return UserResponseBuilder(newUser);
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput
): Promise<UserResponseObject> => {
  try {
    const userFound = await findUser(id);
    const mergedUser = mergeUserProperties(userFound, input);

    const users = UsersDB.map((user) => {
      if (user.id === id) {
        return mergedUser;
      } else return user;
    });

    // Fake DB Transaction
    invalidateUserDB(users);

    return UserResponseBuilder(mergedUser);
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const deleteUser = async (
  id: string
): Promise<UserResponseObject | undefined> => {
  const userFound = await findUserById(id);

  const users = UsersDB.filter((user) => {
    if (user.id === id) {
      return;
    } else return user;
  });
  // Fake DB Transaction
  invalidateUserDB(users);

  return userFound;
};

const mergeUserProperties = (user: User, input: UpdateUserInput): User => {
  return {
    ...user,
    ...input,
  };
};
