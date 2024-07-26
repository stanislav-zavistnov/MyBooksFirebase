import { useNavigate, useParams } from 'react-router-dom';
import styles from './detailsbookpage.module.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useDeleteData } from '../../utils/customHooks/useDeleteItem';
import { Button, Modal } from 'antd';
import { useFetchItemById } from '../../utils/customHooks/useFetchItemById';
import { useEffect } from 'react';

export function DetailsBookPage() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        throw new Error('id not found');
    }
    const { data, loading, error, fetchItem } = useFetchItemById('collectionData', id);
    const navigate = useNavigate();
    const { deleteData } = useDeleteData('collectionData');
    const { confirm } = Modal;
    useEffect(() => {
            fetchItem();
    }, [fetchItem, id]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    function handleDeleteItem() {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
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
    return (
        <div className={styles.pageWrap}>
            <Button danger type='primary' onClick={handleDeleteItem}>
                Удалить книгу
            </Button>
            <div>
                {data?.bookName}
            </div>
        </div>
    );
}