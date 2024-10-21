import { FC } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
    role: "human" | "bot";
    message: string;
}

const Message: FC<Props> = ({ message }) => {
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <Markdown
                children={message}
                components={{
                    code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                            <SyntaxHighlighter
                                PreTag="div"
                                children={String(children).replace(/\n$/, "")}
                                language={match[1]}
                                style={atomDark}
                            />
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        );
                    },
                }}
            />
        </div>
    );
};

export default Message;
