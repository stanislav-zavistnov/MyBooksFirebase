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
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
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
