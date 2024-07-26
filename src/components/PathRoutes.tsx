import { Route, Routes } from 'react-router-dom';
import App from '../App';
import { LeftMainPanel } from './LeftMainPanel/LeftMainPanel';
import { NotFoundPage } from './NotFoundPage/NotFoundPage';
import { useState } from 'react';
import { User } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { DetailsBookPage } from './DetailsBookPage/DetailsBookPage';
import FinishedBooks from './FinishedBooks/FinishedBooks';
import Fireplace from './Fireplace/Fireplace';
import ProcessBooks from './ProcessBooks/ProcessBooks';

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
        <Route path="/process-books" element={<ProcessBooks />} />
        <Route path="/process-books/:id" element={<DetailsBookPage />} />
        <Route path="/finished-books" element={<FinishedBooks />} />
        <Route path="/finished-books/:id" element={<DetailsBookPage />} />
        <Route path="/fireplace" element={<Fireplace />} />
        <Route path="/fireplace/:id" element={<DetailsBookPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default PathRoutes;
