import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";
import MessageContainer from "./MessageContainer";
import { useAppStore } from "@/store/store";

const ChatContainer = () => {
  console.log(useAppStore.getState());
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
