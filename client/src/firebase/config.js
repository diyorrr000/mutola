import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// These are placeholders. In a real project, move these to .env
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "mutola-app.firebaseapp.com",
    projectId: "mutola-app",
    storageBucket: "mutola-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

let app, db, storage, auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { db, storage, auth };
