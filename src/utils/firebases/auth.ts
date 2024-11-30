import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { firebaseApp } from "./config";

const provider = new GoogleAuthProvider();

export const firebaseAuth = getAuth(firebaseApp);

const configurePersistence = async () => {
    try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
    } catch (error) {
        console.error("Error setting persistence:", error);
    }
};

export const signInWithGoogle = async () => {
    await configurePersistence();
    const result = await signInWithPopup(firebaseAuth, provider);
    return result.user;
};

export const signOutFromGoogle = () => signOut(firebaseAuth);
