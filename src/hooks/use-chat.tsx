import { chat } from "@/utils/chat";
import { IMessage, MessageSender } from "@/utils/types";
import { MutableRefObject, useRef, useState } from "react";

interface Props {
    lastMessageRef: MutableRefObject<HTMLDivElement | null>;
}

export const useChat = ({ lastMessageRef }: Props) => {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<IMessage[]>([]);
    const botMessageRef = useRef<IMessage | null>(null);

    const handleSendInput = async () => {
        const userContent = input.trim();
        if (userContent === "") {
            return;
        }

        setIsSending(true);

        const userMessage: IMessage = {
            id: "",
            chatId: "",
            content: userContent,
            sender: MessageSender.User,
            timestamp: new Date(),
        };

        const botMessage: IMessage = {
            id: "",
            chatId: "",
            content: "",
            sender: MessageSender.Assistant,
            timestamp: new Date(),
        };

        const chatHistory = [...history, userMessage];
        setHistory([...chatHistory, botMessage]);
        botMessageRef.current = botMessage;

        await chat({
            chatHistory,
            onReceiveChunk: (chunk) => {
                if (botMessageRef.current) {
                    botMessageRef.current.content += chunk;

                    setHistory((prevHistory) => {
                        if (!botMessageRef.current) return prevHistory;
                        const updatedHistory = [...prevHistory];
                        updatedHistory[updatedHistory.length - 1] = {
                            ...botMessageRef.current,
                        };
                        return updatedHistory;
                    });

                    if (lastMessageRef.current) {
                        lastMessageRef.current.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                }
            },
        });

        setInput("");
        setIsSending(false);
    };

    return {
        input,
        setInput,
        handleSendInput,
        history,
        isSending,
    };
};
