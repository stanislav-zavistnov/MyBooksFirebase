import { useNavigate } from 'react-router-dom';
import { DataItem } from '../../types';
import styles from './bookrow.module.css';

import dayjs from 'dayjs';

interface IItem {
    item: DataItem;
}

export function BookRow({ item }: IItem) {
    const navigate = useNavigate();
    const createdAt = +item.id;
    const convertDate = dayjs(createdAt).format('DD.MM.YYYY');
    console.log('row', convertDate)
    const handleClick = () => {
        if (item.status === 'inProcess') {
            navigate(`/process-books/${item.id}`);
        } else if (item.status === 'finished') {
            navigate(`/finished-books/${item.id}`);
        } else if (item.status === 'fireplace') {
            navigate(`/fireplace/${item.id}`);
        }
    };
    const currentPage = item.dailyResult[item.dailyResult.length - 1].currentPage;
    return (
        <div className={styles.rowWrap} onClick={handleClick} >
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {convertDate}
                </span>
            </div>
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {item.bookName}
                </span>
            </div>
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {currentPage}
                </span>
            </div>
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {item.bookLength}
                </span>
            </div>
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {`${Math.round(+currentPage / +item.bookLength * 100)} %`}
                </span>
            </div>
            <div className={styles.rowData}>
                <span className={styles.dataCount}>
                    {+item.bookLength - +currentPage}
                </span>
            </div>
        </div>
    );
}