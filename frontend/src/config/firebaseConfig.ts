// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "image-upload-cd235.firebaseapp.com",
  projectId: "image-upload-cd235",
  storageBucket: "image-upload-cd235.appspot.com",
  messagingSenderId: "102713450426",
  appId: "1:102713450426:web:f21f034da4a0c43bcb4783"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDb=getStorage(app);

export {imgDb}