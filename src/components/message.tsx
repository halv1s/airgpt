import { IMessage } from "@/utils/types";
import { PersonIcon, RocketIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
    message: IMessage;
}

const Message: FC<Props> = ({ message }) => {
    return (
        <div className="p-4 shadow-md">
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
                    h1({ children, ...props }) {
                        return (
                            <h1
                                className="text-2xl font-bold mt-3 mb-1"
                                {...props}
                            >
                                {children}
                            </h1>
                        );
                    },
                    h2({ children, ...props }) {
                        return (
                            <h2
                                className="text-xl font-bold mt-3 mb-1"
                                {...props}
                            >
                                {children}
                            </h2>
                        );
                    },
                    h3({ children, ...props }) {
                        return (
                            <h3
                                className="text-lg font-bold mt-3 mb-1"
                                {...props}
                            >
                                {children}
                            </h3>
                        );
                    },
                    ul({ children, ...props }) {
                        return (
                            <ul className="list-disc ml-5" {...props}>
                                {children}
                            </ul>
                        );
                    },
                    ol({ children, ...props }) {
                        return (
                            <ol className="list-decimal ml-5" {...props}>
                                {children}
                            </ol>
                        );
                    },
                    li({ children, ...props }) {
                        return (
                            <li className="mb-1" {...props}>
                                {children}
                            </li>
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
