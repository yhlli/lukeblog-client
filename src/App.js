import './App.scss';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ResumePage from './pages/ResumePage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route index element={<IndexPage/>} />
        <Route path={'/about'} element={<AboutPage/>} />
        <Route path={'/resume'} element={<ResumePage/>} />
        <Route path={'/contact'} element={<ContactPage/>} />
        <Route path={'/login'} element={<LoginPage/>} />
        <Route path={'/register'} element={<RegisterPage/>} />
      </Route>
    </Routes>
  );
}

export default App;