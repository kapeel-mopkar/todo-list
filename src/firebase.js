import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqrDKvBorZyoi2HAJLWSHdKwaWUpeCg9U",
  authDomain: "todo-list-ba6a6.firebaseapp.com",
  databaseURL: "https://todo-list-ba6a6-default-rtdb.firebaseio.com",
  projectId: "todo-list-ba6a6",
  storageBucket: "todo-list-ba6a6.appspot.com",
  messagingSenderId: "97794869913",
  appId: "1:97794869913:web:bb11d710299b7f390e0608"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
