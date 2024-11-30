"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/utils/firebases/auth";
import { appState } from "@/utils/state";
import { useRouter } from "next/navigation";

const SignInPage = () => {
    const router = useRouter();

    const handleSignInPress = async () => {
        try {
            const user = await signInWithGoogle();
            appState.jwt = await user.getIdToken();
            router.replace("/");
        } catch (error) {
            console.error("--> sign in failed", error);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <Button onClick={handleSignInPress}>Sign In with Google</Button>
        </div>
    );
};

export default SignInPage;
