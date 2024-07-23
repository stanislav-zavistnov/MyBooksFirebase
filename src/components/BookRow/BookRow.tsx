// import { useNavigate } from 'react-router-dom';
import { DataItem } from '../../types';
import styles from './bookrow.module.css';
import { Button, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDeleteData } from '../../utils/customHooks/useDeleteItem';

interface IItem {
    item: DataItem;
    fetchData: () => void;
}

export function BookRow({ item, fetchData }: IItem) {
    // const navigate = useNavigate();
    const { deleteData } = useDeleteData('collectionData');
    const createdAt = +item.id;
    const convertDate = new Date(createdAt);
    const { confirm } = Modal;
    // const handleClick = () => {
    //     navigate(`/mybook/${item.id}`);
    // };
    function handleDeleteItem() {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteData(item.id);
                fetchData();
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    return (
        <div
            className={styles.rowWrap}
        // onClick={handleClick}
        >
            <span>
                {`${convertDate}`}
            </span>
            <span>
                {`${item.text}`}
            </span>
            <div className={styles.actions}>
                <Button danger type='primary' onClick={handleDeleteItem}>
                    Удалить книгу
                </Button>
            </div>
        </div>
    );
}