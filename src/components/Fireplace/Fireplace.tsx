import { useEffect } from 'react';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';
import { BookRow } from '../BookRow/BookRow';
import styles from './fireplace.module.css';
import { List } from 'antd';

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
        return <List
            pagination={{
                position: 'bottom',
                align: 'center',
                pageSize: 30,
            }}
            dataSource={data}
            renderItem={(item) => (
                <BookRow key={item.id} item={item} />
            )}>
        </List>
    }

    if (!isAuthorized) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.myBookWrap}>
            <h1 className={styles.sectionTitle}>
                Камин
            </h1>
            <div className={styles.myBookList}>
            <div className={styles.titleRow}>
            <span className={styles.dataTitle}>
                        Дата начала
                    </span>
                    <span className={styles.dataTitle}>
                        Название
                    </span>
                    <span className={styles.dataTitle}>
                        Текущая страница
                    </span>
                    <span className={styles.dataTitle}>
                        Всего страниц
                    </span>
                    <span className={styles.dataTitle}>
                        Прогресс %
                    </span>
                    <span className={styles.dataTitle}>
                        Осталось страниц
                    </span>
                </div>
                {renderList()}
            </div>
        </div>
    );
}

export default Fireplace;