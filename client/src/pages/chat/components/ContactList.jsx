import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST } from "@/util/constants";
import React from "react";

const ContactList = ({ contact, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  console.log("selectedChatData", selectedChatData);
  console.log("contact", contact);
  console.log(`${HOST}/${contact?.[0]?.image}`);

  return (
    <div className="mt-5 ">
      {contact?.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center justify-start gap-5 text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                      ${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-[#fffff22] border-2 border-white/70"
                          : getColor(contact.color)
                      }
                      uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full
                    `}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}

            {isChannel && (
              <div className="bg-[#fffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName} {contact.lastName}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="font-semibold">{contact.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
