import { IMessage } from "./types";

interface ChatProps {
    chatHistory: IMessage[];
    onReceiveChunk: (chunk: string) => void;
}

export const chat = async (props: ChatProps) => {
    const { chatHistory, onReceiveChunk } = props;

    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatHistory }),
    });

    if (!response.ok) {
        console.error("Failed to connect to the chat API");
        return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // let botResponse = "";

    while (!done) {
        const { value, done: readerDone } = await reader!.read();
        done = readerDone;
        const chunk = decoder.decode(value);
        if (chunk) {
            const messages = chunk.split("\n\n");
            for (const message of messages) {
                // botResponse += message;
                onReceiveChunk(message);
            }
        }
    }

    // console.log("[Bot Response]");
    // console.log(botResponse);
};
