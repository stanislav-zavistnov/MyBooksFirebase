import { useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';

export const useLogin = () => {
    const firebaseContext = useContext(Context);
    const navigate = useNavigate();

    if (!firebaseContext) {
        throw new Error("Context must be used within a Provider");
    }

    const { auth, firestore } = firebaseContext;

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;

            if (user && user.email) {
                const userRef = firestore.collection('authorizedUsers').doc(user.email);
                userRef.get().then(async (doc) => {
                    if (doc.exists && doc.data()?.allowed) {
                        navigate('/process-books');
                    } else {
                        await auth.signOut();
                        alert(`У вас нет доступа, извините`);
                    }
                });
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    return { login };
};
