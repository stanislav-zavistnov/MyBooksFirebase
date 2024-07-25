import { useCallback, useContext, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { DataItem } from '../../types';
import { Context } from '../../main';

export const useFetchItemById = (collectionName: string, itemId: string) => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore } = context;
    const [data, setData] = useState<DataItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItem = useCallback(async () => {
        if (!itemId) {
            setError('Item ID is required');
            setLoading(false);
            return;
        }

        try {
            const docRef = firestore.collection(collectionName).doc(itemId);
            const doc = await docRef.get();
            
            if (doc.exists) {
                setData({ id: doc.id, ...doc.data() as Omit<DataItem, 'id'> });
            } else {
                setError('No such document!');
            }
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [collectionName, firestore, itemId]);

    return { data, loading, error, fetchItem };
};
