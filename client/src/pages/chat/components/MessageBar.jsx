import { useAppStore } from "@/store/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSocket } from "./SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILES } from "@/util/constants";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const refEmoji = useRef(null);
  const refInput = useRef(null);
  const refFileInput = useRef(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(e) {
      if (refEmoji.current && !refEmoji.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refEmoji]);

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);

    refInput.current?.focus();
  };

  const handleAttachmentClick = () => {
    if (!refFileInput.current) return;
    refFileInput.current?.click();
  };

  const handleAttachmentChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await apiClient.post(UPLOAD_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          console.log("progressEvent", progressEvent);
          setFileUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        },
      });

      if (response.status === 200 && response.data.filePaths) {
        setIsUploading(false);
        const fileUrl = response.data.filePaths;

        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl,
          });
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-4 gap-3">
      <div className="flex-1 flex bg-[#2a2b33] rounded-full items-center gap-3 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-full focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={refInput}
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none foucs:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-xl" />
        </button>
        <input
          type="file"
          ref={refFileInput}
          className="hidden"
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={refEmoji}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#20d967] hover:bg-[#179848] focus:bg-[#179848] rounded-full flex justify-center items-center p-5 duration-200 transition-all focus:outline-none focus:border-none"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;
