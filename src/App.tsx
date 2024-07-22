import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Context } from './main'
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate();
  const context = useContext(Context);
  const [loginedUser, setLoginedUser] = useState<firebase.User | null>(null);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }

  const { auth, firestore } = context;

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged(user => {
      if (user) {
        setLoginedUser(user);
        navigate('/mybooks');
      } else {
        setLoginedUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [auth, navigate]);

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      if (user && user.email) {
        const userRef = firestore.collection('authorizedUsers').doc(user.email);
        userRef.get().then(async (doc) => {
          if (doc.exists && doc.data()?.allowed) {
            navigate('/mybooks');
          } else {
            await auth.signOut();
            alert(`Access denied`);
          }
        })
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <>
      {!loginedUser && (
        <button onClick={login}>
          ВОЙТИ ЧЕРЕЗ ГУГЛ
        </button>
      )}
      {loginedUser && (
        <button onClick={() => { auth.signOut(); setLoginedUser(null) }}>
          <p>
            {loginedUser.email}
          </p>
          Выйти
        </button>
      )}
    </>
  )
}

export default App
