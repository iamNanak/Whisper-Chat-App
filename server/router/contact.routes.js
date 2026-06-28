import { Router } from "express";
import { verfiyToken } from "../middlewares/auth.middleware.js";
import {
  getAllContacts,
  searchContacts,
  getAllContactsForChannels,
} from "../controllers/contacts.controllers.js";

const contactRouter = Router();

contactRouter.post("/search", verfiyToken, searchContacts);
contactRouter.get("/all-contacts", verfiyToken, getAllContacts);
contactRouter.get(
  "/all-contacts-for-channels",
  verfiyToken,
  getAllContactsForChannels,
);

export default contactRouter;
