"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Message from "@/components/message";
import { useEffect, useState, useRef } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { IMessage } from "@/utils/types";
import { chat } from "@/utils/chat";
import { v4 as uuidv4 } from "uuid";

function App() {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<IMessage[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    const botMessageRef = useRef<IMessage | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSendInput = async () => {
        if (!isMounted) return;

        setIsSending(true);

        const userMessage: IMessage = {
            id: uuidv4(),
            content: input,
            isBot: false,
        };
        const botMessage: IMessage = {
            id: uuidv4(),
            content: "",
            isBot: true,
        };

        setHistory((prevHistory) => [...prevHistory, userMessage, botMessage]);
        botMessageRef.current = botMessage;

        await chat({
            content: input,
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
                }
            },
        });

        setInput("");
        setIsSending(false);
    };

    return (
        <div className="flex-grow flex flex-col">
            <div className="flex-grow">
                {history.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
            </div>

            <div className="p-4 flex gap-4">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isSending}
                />
                <Button
                    size="icon"
                    onClick={handleSendInput}
                    disabled={isSending}
                >
                    <PaperPlaneIcon />
                </Button>
            </div>
        </div>
    );
}

export default App;
