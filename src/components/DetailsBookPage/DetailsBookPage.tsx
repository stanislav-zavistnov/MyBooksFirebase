import { useNavigate, useParams } from 'react-router-dom';
import styles from './detailsbookpage.module.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDeleteData } from '../../utils/customHooks/useDeleteItem';
import { Button, Modal } from 'antd';
import { useFetchItemById } from '../../utils/customHooks/useFetchItemById';
import { useEffect } from 'react';
import dayjs from 'dayjs';

export function DetailsBookPage() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        throw new Error('id not found');
    }
    const { data, loading, error, fetchItem } = useFetchItemById('collectionData', id);
    const navigate = useNavigate();
    const { deleteData } = useDeleteData('collectionData');
    const currentPage = data?.dailyResult[data.dailyResult.length - 1].currentPage;
    const convertDate = dayjs(data?.createdAt).format('DD.MM.YYYY');
    const { confirm } = Modal;
    useEffect(() => {
        fetchItem();
    }, [fetchItem, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    function handleDeleteItem() {
        confirm({
            title: 'Действительно хотите удалить книгу?',
            icon: <ExclamationCircleFilled />,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            onOk() {
                if (id) {
                    deleteData(id);
                    navigate(-1);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    function returnCurrentPercent(current: string | undefined, length: string | undefined): number {
        if (current === undefined || length === undefined) {
            return 0;
        }
        return Math.round(+current / +length * 100);
    }
    function returnDifference(current: string | undefined, length: string | undefined): number {
        if (current === undefined || length === undefined) {
            return 0;
        }
        return +length - +current;
    }
    return (
        <div className={styles.pageWrap}>
            <h1 className={styles.sectionTitle}>
                {data?.bookName}
            </h1>
            <div className={styles.infoWrap}>
                <div className={styles.pagesInfo}>
                    <div className={styles.pagesInfoStat}>
                        <span className={styles.pageInfo}>
                            {`В книге ${data?.bookLength} страниц`}
                        </span>
                        <span className={styles.pageInfo}>
                            {`Я на ${currentPage} странице`}
                        </span>
                        <span className={styles.pageInfo}>
                            {`Завершено: ${returnCurrentPercent(currentPage, data?.bookLength)}%`}
                        </span>
                        <span className={styles.pageInfo}>
                            {`Осталось: ${returnDifference(currentPage, data?.bookLength)} страниц`}
                        </span>
                    </div>
                    <div className={styles.pageInfoRating}>
                        <span className={styles.pageInfo}>
                            {`Начало чтения: ${convertDate}`}
                        </span>
                        <span className={styles.pageInfo}>
                            {`Моя оценка книге: ${data?.rating ? data?.rating : 'пока не решила'}`}
                        </span>
                    </div>
                </div>
            </div>
            <Button danger type='primary' onClick={handleDeleteItem}>
                Удалить книгу
            </Button>
        </div>
    );
}