import { useNavigate } from 'react-router-dom';
import { DataItem } from '../../types';
import styles from './bookrow.module.css';

import dayjs from 'dayjs';

interface IItem {
    item: DataItem;
    fetchData: () => void;
}

export function BookRow({ item }: IItem) {
    const navigate = useNavigate();
    const createdAt = +item.id;
    const convertDate = dayjs(createdAt).format('DD.MM.YYYY');
    const handleClick = () => {
        navigate(`/mybooks/${item.id}`);
    };
    return (
        <div
            className={styles.rowWrap}
        onClick={handleClick}
        >
            <span>
                {`${convertDate}`}
            </span>
            <span>
                {`${item.bookName}`}
            </span>
        </div>
    );
}