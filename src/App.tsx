import './App.css'
import { User } from 'firebase/auth';
import firebase from 'firebase/compat/app';

interface IProps {
  user: firebase.User | User | null,
}
function App({ user }: IProps) {
  return (
    <>
      {!user && (
        <h1>
          Авторизуйтесь через Google, пожалуйста.
        </h1>
      )}
      {user && (
        <h1>
          Привет&nbsp;{user.displayName}!
        </h1>
      )}
    </>
  )
}

export default App
