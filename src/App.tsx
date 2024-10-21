import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import Message from "./components/message";

const markdownMessage = `
  # Hello, World!
  This is a message with **bold text**, _italic text_, and a code block:
  
  \`\`\`js
  console.log('Hello, world!');
  \`\`\`
`;

function App() {
    return (
        <div className="flex-grow flex flex-col">
            <div className="flex-grow">
                <Message role="bot" message={markdownMessage} />
            </div>

            <div className="p-4 flex gap-4">
                <Textarea />
                <Button>Send</Button>
            </div>
        </div>
    );
}

export default App;
