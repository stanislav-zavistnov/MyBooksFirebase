import styles from './App.module.css';
import { User } from 'firebase/auth';
import firebase from 'firebase/compat/app';

interface IProps {
  user: firebase.User | User | null,
}
function App({ user }: IProps) {
  return (
    <div className={styles.pageWrap}>
      {!user && (
        <h1 className={styles.title}>
          Авторизуйтесь через Google, пожалуйста.
        </h1>
      )}
      {user && (
        <h1 className={styles.title}>
          Привет&nbsp;{user.displayName}!
        </h1>
      )}
    </div>
  )
}

export default App
