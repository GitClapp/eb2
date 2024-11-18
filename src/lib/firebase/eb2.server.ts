// Import the functions from the SDKs
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { EB2_apiKey, EB2_authDomain, EB2_projectId, EB2_storageBucket, EB2_messagingSenderId, EB2_appId } from "$env/static/private";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: EB2_apiKey,
    authDomain: EB2_authDomain,
    projectId: EB2_projectId,
    storageBucket: EB2_storageBucket,
    messagingSenderId: EB2_messagingSenderId,
    appId: EB2_appId,
};

// Initialize Firebase
let firebaseApp: FirebaseApp = getApps().find(app => app.name === 'eb2') || initializeApp(firebaseConfig, 'eb2');

// Export Database
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);