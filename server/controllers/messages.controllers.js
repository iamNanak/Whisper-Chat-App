import Message from "../models/message.model.js";
import fs from "fs";

const getAllMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { recipient } = req.body;
    console.log("Sender:", sender);
    console.log("Recipient:", recipient);
    if (!sender || !recipient) {
      return res.status(400).send("Sender and Recipient are required");
    }

    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    // console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};

const uplaodFiles = async (req, res) => {
  try {
    const file = req?.file;
    // console.log("req", req);
    // console.log("file", file);
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const date = Date.now();

    let fileDir = `uploads/files/${date}/`;
    let fileName = fileDir + req.file.originalname;

    fs.mkdirSync(fileDir, { recursive: true });

    fs.renameSync(req.file.path, fileName);

    return res.status(200).json({ filePaths: fileName });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export { getAllMessages, uplaodFiles };
