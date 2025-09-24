import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import { useSocketStore } from "../zustand/SocketStore"; // Import Zustand store

const useListenMessages = () => {
  const socket = useSocketStore((state) => state.socket);
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
