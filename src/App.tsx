import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import Message from "./components/message";
import { useState } from "react";

const markdownMessage = `
  # Hello, World!
  This is a message with **bold text**, _italic text_, and a code block:
  
  \`\`\`js
  console.log('Hello, world!');
  \`\`\`
`;

function App() {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState("");

    const handleSendInput = async () => {
        setIsSending(true);
        console.log("--> send:", input);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setInput("");
        setIsSending(false);
    };

    return (
        <div className="flex-grow flex flex-col">
            <div className="flex-grow">
                <Message isBot={true} message={markdownMessage} />
            </div>

            <div className="p-4 flex gap-4">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isSending}
                />
                <Button onClick={handleSendInput} disabled={isSending}>
                    Send
                </Button>
            </div>
        </div>
    );
}

export default App;
