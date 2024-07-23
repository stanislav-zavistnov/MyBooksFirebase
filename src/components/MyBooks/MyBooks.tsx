import { useContext, useEffect, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { Context } from '../../main';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';

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