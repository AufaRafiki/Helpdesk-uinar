// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2zI2cWuSnfiXJ27xoW3jgZv96krh54Bk",
  authDomain: "helpdesk-uinar-92201.firebaseapp.com",
  projectId: "helpdesk-uinar-92201",
  storageBucket: "helpdesk-uinar-92201.appspot.com",
  messagingSenderId: "62728366358",
  appId: "1:62728366358:web:5bcfa7624d7dfefb734837",
  measurementId: "G-GMGZRM0K8C",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Tambahkan inisialisasi Firestore

export { auth, db };
