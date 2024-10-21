import React from "react";
import OpenAI from "openai";

const openai = new OpenAI();

interface ChatProps {
    content: string;
    setAnswer: React.Dispatch<React.SetStateAction<string>>;
}

export const chat = async (props: ChatProps) => {
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: props.content }],
        stream: true,
    });
    for await (const chunk of stream) {
        props.setAnswer(
            (prev) => prev + (chunk.choices[0]?.delta?.content || "")
        );
    }
};
