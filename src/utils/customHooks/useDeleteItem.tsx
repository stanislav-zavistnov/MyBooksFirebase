import { useContext, useCallback, useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { Context } from '../../main';

export const useDeleteData = (collectionName: string) => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore } = context;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteData = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(firestore, collectionName, id);
            await deleteDoc(docRef);
        } catch (err) {
            setError('Error deleting data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [collectionName, firestore]);

    return { deleteData, loading, error };
};
