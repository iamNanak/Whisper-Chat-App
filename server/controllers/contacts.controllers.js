import { User } from "../models/user.model.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchContacts } = req.body;

    if (searchContacts === undefined || searchContacts === null) {
      return res.status(400).send("Search Term is Required");
    }

    const cleanSearchToken = searchContacts.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(cleanSearchToken, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {}
};
