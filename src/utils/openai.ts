import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "",
});

interface ChatProps {
    content: string;
    onReceiveChunk: (chunk: string) => void;
}

export const chat = async (props: ChatProps) => {
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: props.content }],
        stream: true,
    });
    for await (const chunk of stream) {
        props.onReceiveChunk(chunk.choices[0]?.delta?.content || "");
    }
};
