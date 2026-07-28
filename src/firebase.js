import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAf2555B5TZb3sDx1JTw_b_VAoXwuqIavk",
    authDomain: "dre-controller-db.firebaseapp.com",
    projectId: "dre-controller-db",
    storageBucket: "dre-controller-db.firebasestorage.app",
    messagingSenderId: "270849638511",
    appId: "1:270849638511:web:0e5cab9ac4b819e8044d9a"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);