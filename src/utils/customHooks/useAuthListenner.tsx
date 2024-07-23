import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Context } from '../../main';
import { AuthUser } from '../../types';

export const useAuthListener = () => {
    const [user, setUser] = useState<AuthUser>(null);
    const firebaseContext = useContext(Context);

    useEffect(() => {
        if (!firebaseContext) {
            throw new Error("Context must be used within a Provider");
        }

        const { auth } = firebaseContext;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [firebaseContext]);

    return { user };
};
