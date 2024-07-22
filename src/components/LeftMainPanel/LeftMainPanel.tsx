import styles from './leftmainpanel.module.css';
import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Context } from '../../main';
import { Avatar, Button } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

interface IProps {
    handleSetUser: (user: firebase.User | User | null) => void;
}

export function LeftMainPanel({ handleSetUser }: IProps) {
    const [user, setUser] = useState<firebase.User | User | null>(null);
    const { pathname } = useLocation();
    const firebaseContext = useContext(Context);
    if (!firebaseContext) {
        throw new Error("Context must be used within a Provider");
    }
    const { auth, firestore } = firebaseContext;
    const navigate = useNavigate();
    const context = useContext(Context);
    if (!context) {
        throw new Error("Context must be used within a Provider");
    }

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                handleSetUser(user);
            } else {
                setUser(null);
                handleSetUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, handleSetUser]);

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;

            if (user && user.email) {
                const userRef = firestore.collection('authorizedUsers').doc(user.email);
                userRef.get().then(async (doc) => {
                    if (doc.exists && doc.data()?.allowed) {
                        navigate('/mybooks');
                    } else {
                        await auth.signOut();
                        alert(`У вас нет доступа, извините`);
                    }
                })
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };


    useEffect(() => {
        if (firebaseContext) {
            const unsubscribe = onAuthStateChanged(firebaseContext.auth, (currentUser) => {
                setUser(currentUser);
                handleSetUser(currentUser);
            });

            return () => unsubscribe();
        }
    }, [firebaseContext, handleSetUser]);

    function signOutUser() {
        auth.signOut();
        setUser(null);
    }
    return (
        <div className={styles.panelWrap}>
            <div className={styles.usersPanel}>
                {user && (
                    <div className={styles.userInfoWrap}>
                        <Avatar src={user.photoURL} size={'large'} />
                        <span className={styles.userName}>
                            {user.displayName}
                        </span>
                        <Button onClick={signOutUser} type='primary' danger>
                            Выйти
                        </Button>
                    </div>
                )}
                {!user && (
                    <div className={styles.userInfoWrap}>
                        <Button type='primary' onClick={login}>
                            Авторизоваться через Google
                        </Button>
                    </div>
                )}
            </div>
            {user && (
                <div className={styles.navBar}>
                    {pathname !== '/'
                        ? <button onClick={() => { navigate('/') }} className={styles.navBarButton}>
                            Главная
                        </button>
                        : ''
                    }
                    {pathname !== '/mybooks'
                        ? <button onClick={() => { navigate('/mybooks') }} className={styles.navBarButton}>
                            Мои книги
                        </button>
                        : ''
                    }
                </div>
            )}
        </div>
    );
}