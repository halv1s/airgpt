import { proxy } from "valtio";

interface AppState {
    isLoadingFirebase: boolean;
    jwt?: string;
}

export const appState = proxy<AppState>({
    isLoadingFirebase: true,
});
