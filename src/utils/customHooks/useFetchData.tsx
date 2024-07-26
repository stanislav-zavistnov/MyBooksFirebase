import { useCallback, useContext, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { DataItem } from '../../types';
import { Context } from '../../main';

export const useFetchData = (collectionName: string, statusFilter: string) => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore } = context;
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const query = firestore.collection(collectionName)
                .where('status', '==', statusFilter)
                .orderBy('id', 'desc');
            const snapshot = await query.get();
            const fetchedData: DataItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<DataItem, 'id'>
            }));
            setData(fetchedData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [collectionName, firestore, statusFilter]);

    return { data, loading, error, fetchData };
};
