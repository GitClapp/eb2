import { auth } from "$lib/firebase/eb2.server";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";

export const authHandlers = {
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
        await signOut(auth)
    }
}