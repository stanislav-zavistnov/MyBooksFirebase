import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { BrowserRouter as Router } from 'react-router-dom';
import PathRoutes from './components/PathRoutes.tsx';

firebase.initializeApp({
  apiKey: "AIzaSyBaCU0zOa0shbiEdmzOxNI7HhXkEDNtLRc",
  authDomain: "mybookstore-1.firebaseapp.com",
  projectId: "mybookstore-1",
  storageBucket: "mybookstore-1.appspot.com",
  messagingSenderId: "885798984918",
  appId: "1:885798984918:web:a3d52195dde22a71eb3d77",
  measurementId: "G-15R3NBRCY5"
});

export interface FirebaseContextProps {
  firebase: typeof firebase;
  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
}

const auth = firebase.auth();
const firestore = firebase.firestore();
export const Context = createContext<FirebaseContextProps | null>(null);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Context.Provider value={{
      firebase,
      auth,
      firestore
    }}>
      <React.StrictMode>
        <PathRoutes />
      </React.StrictMode>
    </Context.Provider>
  </Router>,
)
