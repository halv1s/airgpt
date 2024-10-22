import { FC } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { RocketIcon, PersonIcon } from "@radix-ui/react-icons";
import { IMessage } from "@/utils/types";

interface Props {
    message: IMessage;
}

const Message: FC<Props> = ({ message }) => {
    return (
        <div className="p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-3 rounded-full bg-slate-100">
                    {message.isBot ? (
                        <RocketIcon className="w-5 h-5" />
                    ) : (
                        <PersonIcon className="w-5 h-5" />
                    )}
                </div>
                <p
                    className={`text-lg font-semibold ${
                        !message.isBot ? "text-sky-700" : ""
                    }`}
                >
                    {message.isBot ? "Bot" : "You"}
                </p>
            </div>

            <Markdown
                components={{
                    code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                            <SyntaxHighlighter
                                PreTag="div"
                                language={match[1]}
                                style={atomDark}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {message.content}
            </Markdown>
        </div>
    );
};

export default Message;
