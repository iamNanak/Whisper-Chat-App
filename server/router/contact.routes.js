import { Router } from "express";
import { verfiyToken } from "../middlewares/auth.middleware.js";
import { searchContacts } from "../controllers/contacts.controllers.js";

const contactRouter = Router();

contactRouter.post("/search", verfiyToken, searchContacts);

export default contactRouter;
