import { IMessage } from "@/utils/types";
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
        chatHistory.map((msg) => {
            if (msg.isBot) {
                return {
                    role: "assistant",
                    content: msg.content,
                } as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;
            } else {
                return {
                    role: "user",
                    content: msg.content,
                } as OpenAI.Chat.Completions.ChatCompletionUserMessageParam;
            }
        });

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Respond Guidelines:
                        1. Understand the Task: Grasp objectives, goals, requirements, constraints, and expected output.
                        2. Minimal Changes: Improve prompts only if simple; enhance clarity for complex prompts without changing structure.
                        3. Reasoning Before Conclusions: Encourage reasoning first; reverse order if examples show reasoning after.
                        4. Reasoning Order: Identify and adjust reasoning and conclusion order as needed.
                        5. Conclusion Last: Always place conclusions last.
                        6. Examples: Include high-quality examples with placeholders [in brackets].
                        7. Clarity and Conciseness: Use clear, direct language; avoid unnecessary details.
                        8. Formatting: Use markdown for readability; avoid using unless requested.
                        9. Preserve User Content: Keep detailed user-provided guidelines and examples; break down vague content.
                        10. Constants: Include constants like rubrics and examples as they are safe from prompt injection.
                        11. Output Format: Specify output format in detail, favoring JSON for structured data; do not wrap JSON in unless requested.`,
                },
                ...openaiMessages,
            ],
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
