import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';
import 'firebase/firestore';
import 'firebase/auth';

interface DataItem {
    id: string,
    text: string,
    createdAt: Date,
}

function MyBooks() {
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore, auth } = context;
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [value, setValue] = useState('');
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const snapshot = await firestore.collection('collectionData').get();
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
    }, [firestore]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    useEffect(() => {
        if (!context) {
            navigate('/');
            return;
        }

        const { auth, firestore } = context;
        const user = auth.currentUser;

        if (user && user.email) {
            const userRef = firestore.collection('authorizedUsers').doc(user.email);
            userRef.get().then((doc) => {
                if (doc.exists && doc.data()?.allowed) {
                    setIsAuthorized(true);
                } else {
                    auth.signOut();
                    navigate('/');
                }
            }).catch((error) => {
                console.error("Error checking authorization:", error);
                auth.signOut();
                navigate('/');
            });
        } else {
            navigate('/');
        }
    }, [context, navigate]);
    //     const fetchData = async () => {
    //         try {
    //             const snapshot = await firestore.collection('collectionData').get();
    //             const fetchedData: DataItem[] = snapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data() as Omit<DataItem, 'id'>
    //             }));
    //             setData(fetchedData);
    //         } catch (err) {
    //             setError('Error fetching data');
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [firestore]);

    useEffect(() => {
        console.log(data);
    }, [data]);

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged(async user => {
            if (user && user.email) {
                const userRef = firestore.collection('authorizedUsers').doc(user.email);
                try {
                    const doc = await userRef.get();
                    if (doc.exists && doc.data()?.allowed) {
                        setIsAuthorized(true);
                        fetchData(); // Fetch data if user is authorized
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

        return () => unsubscribe(); // Clean up the subscription on unmount
    }, [auth, firestore, fetchData, navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    function renderList() {
        return data.map(item => {
            const createdAt = +item.id;
            const convertDate = new Date(createdAt);
            return (
                <div key={item.id}>
                    {`${convertDate}`}
                </div>
            )
        })
    }

    const sendData = () => {
        const dateNow = Date.now();
        firestore.collection('collectionData').add({
            id: dateNow.toString(),
            text: value,
            createdAt: dateNow.toString(),
        });
        setValue('');
        fetchData();
    }

    if (!isAuthorized) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Books</h1>
            <p>Добро пожаловать на страницу ваших книг!</p>
            <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)} />
            <button onClick={sendData}>
                отправить новые данные
            </button>
            {renderList()}
        </div>
    );
}

export default MyBooks;