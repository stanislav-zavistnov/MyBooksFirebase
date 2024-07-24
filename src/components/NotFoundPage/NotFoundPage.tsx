import { Button } from 'antd';
import styles from './notfoundpage.module.css';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
    const navigate = useNavigate();
    function routeToMainPage() {
        navigate('/');
    }
    return (
        <div className={styles.pageWrap}>
            <h1 className={styles.title}>
                Страница не существует.
            </h1>
            <h1 className={styles.title}>
                Давайте вернемся к началу.
            </h1>
            <Button type='primary' onClick={routeToMainPage}>
                На главную
            </Button>
        </div>
    );
}