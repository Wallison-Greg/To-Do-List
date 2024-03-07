import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC9V4U-qadeMpL3kE37b0aFmOB5U8Sp5jY",
  authDomain: "to-do-list-6554a.firebaseapp.com",
  projectId: "to-do-list-6554a",
  storageBucket: "to-do-list-6554a.appspot.com",
  messagingSenderId: "212818199129",
  appId: "1:212818199129:web:300852e8e5df5b5663a748"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db}