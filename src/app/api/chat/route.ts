import { IMessage, MessageSender } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const {
        chatHistory,
    }: {
        chatHistory: IMessage[] | undefined;
    } = await req.json();

    if (!chatHistory) {
        return NextResponse.json(
            { error: "Chat history is required" },
            { status: 400 }
        );
    }

    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [];
    chatHistory.forEach((msg) => {
        if (msg.sender === MessageSender.Assistant) {
            openaiMessages.push({
                role: "assistant",
                content: msg.content,
            } as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam);
        } else if (msg.sender === MessageSender.User) {
            openaiMessages.push({
                role: "user",
                content: msg.content,
            } as OpenAI.Chat.Completions.ChatCompletionUserMessageParam);
        }
    });

    try {
        const stream = await openai.chat.completions.create({
            model: "ft:gpt-4o-mini-2024-07-18:personal:hieudeptrai:AZHltsrN",
            messages: openaiMessages,
            stream: true,
            temperature: 0.2,
        });

        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const data =
                        chunk.choices[0]?.delta?.content?.replaceAll(
                            "\n",
                            // https://github.com/remarkjs/react-markdown/issues/273
                            "  \n"
                        ) || "";
                    if (data) {
                        controller.enqueue(`${data}\n\n`);
                    }
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("[Chat]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
