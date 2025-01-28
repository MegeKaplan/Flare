import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import MessageItem from "../components/MessageItem";
import { FaPaperPlane } from "react-icons/fa6";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [recipientId, setRecipientId] = useState(useParams().id);
  const [recipientData, setRecipientData] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userData")).id;

  useEffect(() => {
    const fetchRecipientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${recipientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRecipientData(response.data.response);
        setRecipientId(response.data.response.id);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
      }
    };
    fetchRecipientData();
  }, [recipientId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const outgoingMessages = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/messages/${userId}?recipient_id=${recipientId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const incomingMessages = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/messages/${recipientId}?recipient_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(
          [
            ...outgoingMessages.data.response,
            ...incomingMessages.data.response,
          ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        );
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
      }
    };
    fetchMessages();
    setIsMessageSent(false);

    const intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [recipientId, isMessageSent]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error(MESSAGES.MESSAGE_TEXT_REQUIRED);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/${recipientId}`,
        {
          sender_id: userId,
          text: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsMessageSent(true);
      setMessages([...messages, response.data.response]);
      setNewMessage("");
    } catch (error) {
      toast.error(MESSAGES.ERROR_OCCURRED);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-scroll flex flex-col h-full pb-32">
      <div className="flex items-center justify-center flex-col p-3">
        <div className="size-32 aspect-square rounded-full overflow-hidden border-4 border-primary-400 shadow-sm">
          <img
            src={recipientData.pp_url || defaultProfilePicture}
            alt={`profile picture of ${recipientData.username}`}
          />
        </div>
        <h1 className="w-full truncate flex items-center justify-center p-2 text-2xl">
          {recipientData.username}
        </h1>
      </div>
      <div className="flex flex-col p-3">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageItem
              key={message.id}
              data={message}
              className={
                userId === message.sender_id
                  ? "bg-primary-300 justify-end ml-auto" +
                    (index < messages.length - 1 &&
                    messages[index].sender_id === userId &&
                    messages[index + 1].sender_id === userId
                      ? " mb-0"
                      : " mb-1") +
                    (index === 0 || messages[index - 1].sender_id !== userId
                      ? " mt-0"
                      : " mt-0") +
                    (index === 0 || messages[index - 1].sender_id !== userId
                      ? " rounded-t-2xl pt-3"
                      : "") +
                    (index === messages.length - 1 ||
                    messages[index + 1].sender_id !== userId
                      ? " rounded-b-2xl pb-3"
                      : "")
                  : "bg-secondary-200 justify-start" +
                    (index < messages.length - 1 &&
                    messages[index].recipient_id === userId &&
                    messages[index + 1].recipient_id === userId
                      ? " mb-0"
                      : " mb-1") +
                    (index === 0 || messages[index - 1].recipient_id !== userId
                      ? " mt-0"
                      : " mt-0") +
                    (index === 0 || messages[index - 1].recipient_id !== userId
                      ? " rounded-t-2xl pt-3"
                      : "") +
                    (index === messages.length - 1 ||
                    messages[index + 1].recipient_id !== userId
                      ? " rounded-b-2xl pb-3"
                      : "")
              }
            />
          ))
        ) : (
          <h1 className="text-center text-2xl">
            <span className="text-primary-500">{recipientData.username}</span>{" "}
            ile sohbete başla!
          </h1>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex items-center justify-center">
        <form
          className="fixed bottom-16 w-11/12 p-2 bg-secondary-150 flex items-center justify-center shadow-lg rounded-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Bir mesaj yaz..."
            className="w-full h-full p-4 rounded-full bg-secondary-50 focus:bg-primary-50 hover:bg-primary-50 mr-2 outline-none"
            value={newMessage}
            onChange={handleInputChange}
          />
          <button className="bg-primary-400 p-4 rounded-full flex items-center justify-center hover:px-12 transition-all">
            <FaPaperPlane color="white" size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
