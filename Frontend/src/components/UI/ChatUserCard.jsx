import { useQueryClient } from "@tanstack/react-query";
import { authUser } from "../../context/authUser";
import { useChatContext } from "../../context/chatContext"
import { decryptMessage } from "../../Encryption/aes";
import { decryptAESKey } from "../../Encryption/rsa";
import { updateFriendLastMessage } from "../../utils/updateLastMessage";
import { formattedTime } from "../../utils/formatedDate";


export const ChatUserCard = ({ friend, isOnline, isTyping }) => {
  const { setCurrentChat } = useChatContext();
  const { user, privateKey } = authUser();
  let { encryptedMessage, encryptedAESKeys, message, isSender = false, image, msgTime, createdAt, sender, status } = friend?.lastMessage || {};
  const queryClient = useQueryClient()
  if (privateKey && encryptedAESKeys?.[user?._id]) {
    if (encryptedMessage.trim() !== 0) {
      const aesKey = decryptAESKey(encryptedAESKeys[user?._id], privateKey);
      message = decryptMessage(encryptedMessage, aesKey)?.slice(0, 40) || "";
    }
    msgTime = formattedTime(createdAt)
    isSender = sender === user?._id;
  }

  if (image) {
    message = `sent ${!isSender ? "you" : ""} a image`
  }

  const handleOnclick = () => {
    updateFriendLastMessage({
      queryClient,
      friendId: friend._id,
      isSender: false,
      status: 'read',
      message,
      msgTime
    });
    setCurrentChat(friend);
  };

  const showNotificationDot = (!isSender && status == 'sent');



  return (
    <div
      onClick={handleOnclick}
      className={`relative card flex gap-3 items-center p-3 rounded-lg cursor-pointer transition-all duration-150 
        ${!status === 'sent' ? 'dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
    >
      {/* Avatar with online dot */}
      <div className="relative">
        <div className="w-11 h-11 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2">
          <img className="w-full h-full object-cover" src={friend.avatar} alt={friend.fullName} />
        </div>
        {isOnline && (<span className="absolute w-2 h-2 bg-green-500 ring-2 ring-white bottom-0.5 right-0 rounded-full" />)}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <p className="text-md font-semibold truncate dark:text-gray-50">{friend.fullName}</p>
          {msgTime && <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{msgTime}</p>}
        </div>

        <div className="flex justify-between items-center mt-0.5">
          {isTyping ? (
            <p className="text-xs font-mono text-green-500">typing...</p>
          ) : (
            <p className={`text-sm truncate ${showNotificationDot ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-300'}`} >
              {isSender && "You: "}
              {message}
            </p>
          )}

          {/* Orange dot for new unread messages */}
          {showNotificationDot && (<span className="ml-2 w-2.5 h-2.5 bg-orange-500 rounded-full" />)}
        </div>
      </div>
    </div>
  );
};
