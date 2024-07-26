import { useEffect } from 'react';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';
import { BookRow } from '../BookRow/BookRow';
import styles from './fireplace.module.css';

function Fireplace() {
    const { isAuthorized } = useAuthorizationCheck();
    const { data, loading, error, fetchData } = useFetchData('collectionData', 'fireplace');

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
                <BookRow key={item.id} item={item} fetchData={fetchData} />
            )
        })
    }

    if (!isAuthorized) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.myBookWrap}>
            <h1 className={styles.sectionTitle}>
                Fireplace
            </h1>
            <p>
                Добро пожаловать на страницу ваших книг!
            </p>
            <div className={styles.myBookList}>
                {renderList()}
            </div>
        </div>
    );
}

export default Fireplace;