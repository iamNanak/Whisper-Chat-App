import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";

import { apiClient } from "@/lib/api-client";
import {
  GET_ALL_CONTACTS_FOR_CHANNELS,
  HOST,
  SEARCH_CONTACTS,
} from "@/util/constants";

import { useAppStore } from "@/store/store";
import MultipleSelector from "@/components/ui/multiSelect";

const ChannelsDM = () => {
  const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
  const [searchContact, setSearchContact] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  const { setSelectedChatData, setSelectedChatType } = useAppStore();

  useEffect(() => {
    const getData = async (req, res) => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS_FOR_CHANNELS, {
          withCredentials: true,
        });
        setAllContacts(response.data.contacts);
      } catch (error) {}
    };
  }, []);

  const createChannel = async () => {};

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-200 cursor-pointer transition-all duration-300"
              onClick={() => {
                setOpenNewChannelModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="border-none mb-2 p-3 bg-[#1c1b1e]">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewChannelModal}
        onOpenChange={setOpenNewChannelModal}
        className="rounded-lg"
      >
        <DialogContent className="rounded-lg bg-[#181920] border-none text-white flex flex-col w-[400px] h-[400px]">
          <DialogHeader>
            <DialogTitle>
              Please Fill up the Details for new Channel
            </DialogTitle>
            <hr />
            <DialogDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-xl p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No result found.
                </p>
              }
            />
          </div>
          <div>
            <button
              className="bg-purple-700 hover:bg-purple-900 w-full transition-all duration-300 rounded-lg p-3 mt-5"
              onClick={createChannel}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelsDM;
