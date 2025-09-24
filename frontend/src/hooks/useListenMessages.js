import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import { useSocketStore } from "../zustand/SocketStore";

const useListenMessages = () => {
  const socket = useSocketStore((state) => state.socket);
  const { setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => setMessages(prev => [...prev, newMessage]);
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, setMessages]);
};

export default useListenMessages;
