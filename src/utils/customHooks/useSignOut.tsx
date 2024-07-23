import { useContext } from 'react';
import { Context } from '../../main';

export const useSignOut = () => {
    const firebaseContext = useContext(Context);

    if (!firebaseContext) {
        throw new Error("Context must be used within a Provider");
    }

    const { auth } = firebaseContext;

    const signOutUser = () => {
        auth.signOut();
    };

    return { signOutUser };
};
