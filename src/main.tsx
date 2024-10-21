import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <SidebarProvider>
            <AppSidebar />
            <main className="h-screen w-full flex flex-col">
                <nav className="flex items-center gap-2 p-2">
                    <SidebarTrigger className="[&_svg]:size-6" />
                    <h1 className="text-lg font-bold">Air GPT</h1>
                </nav>
                <App />
            </main>
        </SidebarProvider>
    </StrictMode>
);
