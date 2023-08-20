import express from "express";
import { validate } from "../middleware/validate";
import { userCreateBodySchema, userLoginBodySchema } from "../schema/user";

const router = express.Router();

router.get("/users");

export default router;
