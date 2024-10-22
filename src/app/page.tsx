"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Message from "@/components/message";
import { useState } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { IMessage } from "@/utils/types";
// import { chat } from "@/utils/openai";

function App() {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<IMessage[]>([]);

    const handleSendInput = async () => {
        setIsSending(true);

        const userMessage: IMessage = {
            id: "123",
            content: input,
            isBot: false,
        };
        const botMessage: IMessage = {
            id: "456",
            content: "",
            isBot: true,
        };
        setHistory((prevHistory) => [...prevHistory, userMessage, botMessage]);

        // await chat({
        //     content: input,
        //     onReceiveChunk: (chunk) => {
        //         setHistory((prevHistory) => {
        //             const updatedHistory = [...prevHistory];
        //             const lastMessage =
        //                 updatedHistory[updatedHistory.length - 1];
        //             lastMessage.content += chunk;
        //             return updatedHistory;
        //         });
        //     },
        // });

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
