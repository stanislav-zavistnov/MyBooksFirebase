import { Route, Routes } from 'react-router-dom';
import App from '../App';
import { LeftMainPanel } from './LeftMainPanel/LeftMainPanel';
import { NotFoundPage } from './NotFoundPage/NotFoundPage';
import { useState } from 'react';
import { User } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import MyBooks from './MyBooks/MyBooks';

function PathRoutes() {
  const [user, setUser] = useState<firebase.User | User | null>(null);
  function handleSetUser(user: firebase.User | User | null) {
    setUser(user);
  }
  return (
    <>
      <LeftMainPanel handleSetUser={handleSetUser}/>
      <Routes>
        <Route path="/" element={<App user={user}/>} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default PathRoutes;
