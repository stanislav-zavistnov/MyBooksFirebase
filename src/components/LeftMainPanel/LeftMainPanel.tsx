import styles from './leftmainpanel.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button } from 'antd';
import { useLogin } from '../../utils/customHooks/useLogin';
import { useSignOut } from '../../utils/customHooks/useSignOut';
import { AuthUser } from '../../types';
import { useEffect } from 'react';
import { useAuthListener } from '../../utils/customHooks/useAuthListenner';

interface IProps {
    handleSetUser: (user: AuthUser) => void;
}

export function LeftMainPanel({ handleSetUser }: IProps) {
    const { user } = useAuthListener();
    const { pathname } = useLocation();
    const { login } = useLogin();
    const { signOutUser } = useSignOut();
    const navigate = useNavigate();

    useEffect(() => {
        handleSetUser(user);
    }, [user, handleSetUser]);

    return (
        <div className={styles.panelWrap}>
            <div className={styles.usersPanel}>
                {user ? (
                    <div className={styles.userInfoWrap}>
                        <Avatar src={user.photoURL} size={'large'} />
                        <span className={styles.userName}>
                            {user.displayName}
                        </span>
                        <Button onClick={signOutUser} type='primary' danger>
                            Выйти
                        </Button>
                    </div>
                ) : (
                    <div className={styles.userInfoWrap}>
                        <Button type='primary' onClick={login}>
                            Авторизоваться через Google
                        </Button>
                    </div>
                )}
            </div>
            {user && (
                <div className={styles.navBar}>
                    <button
                        onClick={() => { navigate('/') }}
                        className={`${styles.navBarButton} ${pathname === '/' ? styles.activePath : ''}`}>
                        Главная
                    </button>
                    <button
                        onClick={() => { navigate('/mybooks') }}
                        className={`${styles.navBarButton} ${pathname === '/mybooks' ? styles.activePath : ''}`}>
                        Мои книги
                    </button>
                    <button
                        onClick={() => { navigate('/finished-books') }}
                        className={`${styles.navBarButton} ${pathname === '/finished-books' ? styles.activePath : ''}`}>
                        Прочитанные
                    </button>
                    <button
                        onClick={() => { navigate('/fireplace') }}
                        className={`${styles.navBarButton} ${pathname === '/fireplace' ? styles.activePath : ''}`}>
                        Камин
                    </button>
                </div>
            )}
        </div>
    );
}
