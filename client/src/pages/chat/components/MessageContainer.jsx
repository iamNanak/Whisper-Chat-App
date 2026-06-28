import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store/store";
import { GET_ALL_MESSAGES, HOST } from "@/util/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";

const MessageContainer = () => {
  const scrollRef = useRef();

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const fetchMessages = async () => {
    try {
      console.log("fetching messages for", selectedChatType);

      const response = await apiClient.post(
        GET_ALL_MESSAGES,
        {
          recipient: selectedChatData._id,
        },
        { withCredentials: true },
      );

      if (response.data.messages) {
        console.log("all-messages", response.data.messages);
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const msgDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = msgDate != lastDate;
      lastDate = msgDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="flex justify-center items-center">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  useEffect(() => {
    if (selectedChatData._id) {
      if (selectedChatType === "contact") fetchMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [selectedChatMessages]);

  // const isImage = (fileUrl) => {
  //   const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  //   return imageExtensions.some((ext) => fileUrl.toLowerCase().endsWith(ext));
  // };

  const checkIfImage = (filePath) => {
    const imgRegex =
      /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tif|tiff|heic|heif)$/i;
    return imgRegex.test(filePath);
  };

  const handleDownload = async (fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: "blob",
      withCredentials: true,
      onDownloadProgress: (progressEvent) => {
        // console.log(progressEvent);
        setFileDownloadProgress(
          Math.round((progressEvent.loaded * 100) / progressEvent.total),
        );
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileUrl.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#32f493]/90 border-[#1ceda0]/90"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
          } border inline-block p-4 rounded-3xl my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#32f493]/90 border-[#1ceda0]/90"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
          } border inline-block p-4 rounded-3xl my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                alt="Uploaded"
                className=""
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span
                className="text-white/8 text-3xl bg-black/20 rounded-full p-3
              "
              >
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => handleDownload(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-500">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div
          className="fixed inset-0 top-0 left-0 h-[100vh] w-[100vw] flex justify-center items-center z-50 backdrop-blur-lg flex-col"
          onClick={() => setShowImage(false)}
        >
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="Uploaded"
              className="w-full h-[80vh] bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => handleDownload(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>

            <button
              className="bg-black/20 rounded-full p-3 text-2xl hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
