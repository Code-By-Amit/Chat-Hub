import { useQueryClient } from '@tanstack/react-query';


export const updateFriendLastMessage = ({ friendId, message, isSender,msgTime, status,queryClient }) => {
  queryClient.setQueryData(['userFriends'], oldFriends => {
    if (!oldFriends) return [];

    return oldFriends.map(friend =>
      friend._id === friendId
        ? {
            ...friend,
             lastMessage: {
                message, // make sure it's the same shape as in query
                isSender,
                status,
                msgTime
              },
          }
        : friend
    );
  });
};