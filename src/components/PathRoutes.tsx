import { Route, Routes } from 'react-router-dom';
import App from '../App';
import MyBooks from './MyBooks';

function PathRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/mybooks" element={<MyBooks />} />
    </Routes>
  );
}

export default PathRoutes;
