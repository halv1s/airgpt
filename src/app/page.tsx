"use client";

import Message from "@/components/message";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/use-chat";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useRef } from "react";

function App() {
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const { input, isSending, history, setInput, handleSendInput } = useChat({
        lastMessageRef,
    });

    return (
        <ProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <div className="h-screen flex-grow flex flex-col">
                    <div className="flex items-center gap-2 p-2">
                        <SidebarTrigger className="[&_svg]:size-6" />
                        <p className="text-lg font-bold">AirGPT</p>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="flex-grow h-0"
                        >
                            {history.map((message, index) => (
                                <div
                                    ref={
                                        index === history.length - 1
                                            ? lastMessageRef
                                            : null
                                    }
                                    key={index}
                                >
                                    <Message message={message} />
                                </div>
                            ))}
                        </ScrollArea>

                        <div className="p-4 flex gap-4 border-t border-slate-200">
                            <Textarea
                                value={input}
                                onChange={(e) => {
                                    if (!isSending) {
                                        setInput(e.target.value);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendInput();
                                    }
                                }}
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
                </div>
            </SidebarProvider>
        </ProtectedRoute>
    );
}

export default App;
