import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { AuthUser } from '../../types';

export const useAuthorizationCheck = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const context = useContext(Context);
    const navigate = useNavigate();
    
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }

    const { firestore, auth } = context;

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged(async (user: AuthUser | null) => {
            if (user && user.email) {
                const userRef = firestore.collection('authorizedUsers').doc(user.email);
                try {
                    const doc = await userRef.get();
                    if (doc.exists && doc.data()?.allowed) {
                        setIsAuthorized(true);
                    } else {
                        await auth.signOut();
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Error checking authorization:", error);
                    await auth.signOut();
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [auth, firestore, navigate]);

    return { isAuthorized };
};
