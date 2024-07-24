import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { Context } from '../../main';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';
import { BookRow } from '../BookRow/BookRow';
import styles from './mybooks.module.css';
import { Button, DatePicker, Form, Input, InputRef, Modal } from 'antd';

function MyBooks() {
    const [form] = Form.useForm();
    const { isAuthorized } = useAuthorizationCheck();
    const { data, loading, error, fetchData } = useFetchData('collectionData');
    const [modalCreate, setModalCreate] = useState(false);
    const [valueInputNumber, setValueInputNumber] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const context = useContext(Context);
    const valueInputRef = useRef<InputRef>(null);
    const currentPageRef = useRef<InputRef>(null);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }
    const { firestore } = context;

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

    const sendData = async () => {
        const dateNow = Date.now();
        const id = dateNow.toString();

        const formValues = form.getFieldsValue();
        const { bookName, started, bookLength, currentPage } = formValues;

        try {
            const docRef = firestore.collection('collectionData').doc(id);
            await docRef.set({
                id: id,
                bookName,
                author: '',
                dailyResult: [{started: started ? started.format('YYYY-MM-DD') : '', currentPage}],
                bookLength,
                createdAt: dateNow.toString(),
                comment: '',
                rating: '',
            });

            form.resetFields();
            await fetchData();
            setModalCreate(false);
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    if (!isAuthorized) {
        return <div>Loading...</div>;
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const sanitizedValue = inputValue.replace(/\D/g, '');

        if (e.target.id === 'bookLengthInput') {
            setValueInputNumber(sanitizedValue);
            form.setFieldsValue({ bookLength: sanitizedValue });
        } else if (e.target.id === 'currentPageInput') {
            setCurrentPage(sanitizedValue);
            form.setFieldsValue({ currentPage: sanitizedValue });
        }
    };

    return (
        <div className={styles.myBookWrap}>
            <h1 className={styles.sectionTitle}>
                My Books
            </h1>
            <p>
                Добро пожаловать на страницу ваших книг!
            </p>
            <Button type="primary" onClick={() => setModalCreate(true)}>
                Vertically centered modal dialog
            </Button>
            <Modal
                title="Vertically centered modal dialog"
                centered
                open={modalCreate}
                onOk={sendData}
                onCancel={() => { setModalCreate(false); form.resetFields(); }}
            >
                <Form form={form}>
                    <Form.Item
                        name={'bookName'}
                        label={'Название книги'}
                        required={true}
                    >
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item
                        name={'started'}
                        label={'Дата начала'}
                        required={true}
                    >
                        <DatePicker allowClear/>
                    </Form.Item>
                    <Form.Item
                        name={'bookLength'}
                        label={'Всего страниц'}
                        required={true}
                    >
                        <Input
                            id="bookLengthInput"
                            ref={valueInputRef}
                            value={valueInputNumber}
                            onChange={handleChangeInput}
                            placeholder="всего страниц в книге"
                            maxLength={5}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item
                        name={'currentPage'}
                        label={'Я на странице №'}
                        required={true}
                    >
                        <Input
                            id="currentPageInput"
                            ref={currentPageRef}
                            value={currentPage}
                            onChange={handleChangeInput}
                            placeholder="Я на странице №"
                            maxLength={5}
                            allowClear
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <div className={styles.myBookList}>
                {renderList()}
            </div>
        </div>
    );
}

export default MyBooks;