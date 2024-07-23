import { useContext, useEffect, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { Context } from '../../main';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';
import { BookRow } from '../BookRow/BookRow';
import styles from './mybooks.module.css';
import { Button } from 'antd';

function MyBooks() {
    const { isAuthorized } = useAuthorizationCheck();
    const { data, loading, error, fetchData } = useFetchData('collectionData');
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore } = context;
    const [value, setValue] = useState('');

    useEffect(() => {
        if (isAuthorized) {
            fetchData();
        }
    }, [isAuthorized, fetchData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    function renderList() {
        return data.map(item => {
            return (
                <BookRow key={item.id} item={item} fetchData={fetchData}/>
            )
        })
    }

    const sendData = async () => {
        const dateNow = Date.now();
        const id = dateNow.toString();

        try {
            const docRef = firestore.collection('collectionData').doc(id);
            await docRef.set({
                id: id,
                text: value,
                createdAt: dateNow.toString(),
            });

            setValue('');
            await fetchData();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    if (!isAuthorized) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.myBookWrap}>
            <h1 className={styles.sectionTitle}>My Books</h1>
            <p>Добро пожаловать на страницу ваших книг!</p>
            <input
                className={styles.myBookInput}
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)} />
            <Button type='primary' className={styles.myBookBtn} onClick={sendData}>
                отправить новые данные
            </Button>
            <div className={styles.myBookList}>
                {renderList()}
            </div>
        </div>
    );
}

export default MyBooks;