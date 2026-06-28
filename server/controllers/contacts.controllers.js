import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import Message from "../models/message.model.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchContacts } = req.body;

    if (searchContacts === undefined || searchContacts === null) {
      return res.status(400).send("Search Term is Required");
    }

    const cleanSearchToken = searchContacts.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const regex = new RegExp(cleanSearchToken, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    // console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllContacts = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    console.log("user ID", userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$recipient", "$sender"],
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllContactsForChannels = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "firstName lastName _id email",
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};
