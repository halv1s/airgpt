import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    const { content } = await req.json();

    if (!content) {
        return NextResponse.json(
            { error: "Content is required" },
            { status: 400 }
        );
    }

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Be concise and direct. Between lines, add \\n.",
                },
                { role: "user", content },
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
                    console.log("[BE Chunk]", data);
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
