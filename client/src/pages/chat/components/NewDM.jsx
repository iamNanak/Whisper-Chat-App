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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS } from "@/util/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/store";

const NewDM = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchContact, setSearchContact] = useState([]);

  const { setSelectedChatData, setSelectedChatType } = useAppStore();

  const searchContacts = async (searchContacts) => {
    try {
      if (searchContacts.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS,
          { searchContacts },
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.contacts) {
          setSearchContact(res.data.contacts);
        }
      } else {
        setSearchContact([]);
      }
    } catch (error) {}
  };

  const selectContact = (contact) => {
    // console.log(contact);
    setOpenNewContactModal(false);
    setSearchContact([]);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
  };

  // console.log(setSelectedChatData);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-200 cursor-pointer transition-all duration-300"
              onClick={() => {
                setOpenNewContactModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="border-none mb-2 p-3 bg-[#1c1b1e]">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewContactModal}
        onOpenChange={setOpenNewContactModal}
        className="rounded-lg"
      >
        <DialogContent className="rounded-lg bg-[#181920] border-none text-white flex flex-col w-[400px] h-[400px]">
          <DialogHeader>
            <DialogTitle>Please Select Contact</DialogTitle>
            <hr />
            <DialogDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-xl p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchContact.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div>
                {searchContact.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center
                cursor-pointer mb-2"
                    onClick={() => selectContact(contact)}
                  >
                    <div
                      className="relative w-12 h-12"
                      onClick={() => searchContact(contact)}
                    >
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black border-2"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName}-${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchContact.length <= 0 && (
            <div className="flex-1  md:flex flex-col mt-5 justify-center items-center duration-1000 transition-all rounded-xl">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-4 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search New{" "}
                  <span className="text-purple-500">Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
