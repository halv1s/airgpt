import { Textarea } from "@/components/ui/textarea";
import { Button } from "./components/ui/button";

function App() {
    return (
        <div className="flex-grow flex flex-col">
            {/* Chat Container */}
            <div className="flex-grow"></div>

            <div className="p-4 flex gap-4">
                <Textarea />
                <Button>Send</Button>
            </div>
        </div>
    );
}

export default App;
