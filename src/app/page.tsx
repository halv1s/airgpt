"use client";

import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/use-chat";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useRef } from "react";

function App() {
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const { input, isSending, history, setInput, handleSendInput } = useChat({
        lastMessageRef,
    });

    return (
        <div className="flex-grow flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-grow h-0">
                {history.map((message, index) => (
                    <div
                        ref={
                            index === history.length - 1 ? lastMessageRef : null
                        }
                        key={message.id}
                    >
                        <Message message={message} />
                    </div>
                ))}
            </ScrollArea>

            <div className="p-4 flex gap-4 border-t border-slate-200">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendInput();
                        }
                    }}
                    disabled={isSending}
                    placeholder="Ask something..."
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
