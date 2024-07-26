import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import 'firebase/firestore';
import 'firebase/auth';
import { Context } from '../../main';
import { useFetchData } from '../../utils/customHooks/useFetchData';
import { useAuthorizationCheck } from '../../utils/customHooks/useAuthorizationCheck';
import { BookRow } from '../BookRow/BookRow';
import styles from './processbooks.module.css';
import { Button, DatePicker, Form, Input, InputRef, List, message, Modal } from 'antd';
import { disabledDate } from '../../utils/disabledDate';

function ProcessBooks() {
    const [form] = Form.useForm();
    const { isAuthorized } = useAuthorizationCheck();
    const { data, loading, error, fetchData } = useFetchData('collectionData', 'inProcess');
    const [modalCreate, setModalCreate] = useState(false);
    const [valueInputNumber, setValueInputNumber] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const context = useContext(Context);
    const valueInputRef = useRef<InputRef>(null);
    const currentPageRef = useRef<InputRef>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (showSuccess) {
            messageApi.open({
                type: 'success',
                content: 'Успешно добавлено в коллекцию',
            });
            setShowSuccess(false);
        }
    }, [showSuccess, messageApi]);

    useEffect(() => {
        if (showError) {
            messageApi.open({
                type: 'error',
                content: 'Произошла ошибка при создании книги',
            });
            setShowError(false);
        }
    }, [showError, messageApi]);
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

    const sendData = async () => {
        const formValues = await form.validateFields();
        const dateNow = Date.now();
        const id = dateNow.toString();
        const { bookName, started, bookLength, currentPage } = formValues;
        const statusOfReading = currentPage === bookLength ? 'finished' : 'inProcess';
        try {
            const docRef = firestore.collection('collectionData').doc(id);
            await docRef.set({
                id: id,
                bookName,
                author: '',
                dailyResult: [{ started: started ? started.format('YYYY-MM-DD') : '', currentPage }],
                bookLength,
                createdAt: dateNow.toString(),
                comment: '',
                rating: '',
                status: statusOfReading,
            });

            form.resetFields();
            await fetchData();
            setModalCreate(false);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error adding document:', error);
            setShowError(true);
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
            {contextHolder}
            <h1 className={styles.sectionTitle}>
                Книги в процессе
            </h1>
            <Button className={styles.createButton} type="primary" onClick={() => setModalCreate(true)}>
                Добавить книгу
            </Button>
            <Modal
                title="Создание новой книги"
                centered
                open={modalCreate}
                cancelText='Отмена'
                okText='Создать'
                onOk={sendData}
                onCancel={() => { setModalCreate(false); form.resetFields(); }}
            >
                <Form form={form}>
                    <Form.Item
                        name={'bookName'}
                        label={'Название книги'}
                        rules={[
                            {
                                required: true,
                                message: 'Введите название книги',
                            },
                        ]}
                    >
                        <Input allowClear />
                    </Form.Item>
                    <Form.Item
                        name={'started'}
                        label={'Дата начала'}
                        rules={[
                            {
                                required: true,
                                message: 'Выберите дату начала чтения',
                            },
                        ]}
                    >
                        <DatePicker allowClear disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        name={'bookLength'}
                        label={'Всего страниц'}
                        rules={[
                            {
                                required: true,
                                message: 'Укажите кол-во страниц в книге',
                            },
                        ]}
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
                        rules={[
                            {
                                required: true,
                                message: 'Текущая страница',
                            },
                            {
                                validator: (_, value) => {
                                    const bookLength = form.getFieldValue('bookLength');
                                    if (!value || Number(value) <= Number(bookLength)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Текущая страница не может быть больше длины книги'));
                                }
                            }
                        ]}
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

export default ProcessBooks;