import './App.scss';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ResumePage from './pages/ResumePage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import {UserContextProvider} from "./UserContext";
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import UserPage from './pages/UserPage';
import EditBio from './pages/EditBio';
import WeatherPage from './pages/WeatherPage';
import BlackJack from './pages/BlackJackPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path={'/'} element={<Layout />}>
          <Route index element={<IndexPage/>} />
          <Route path={'/about'} element={<AboutPage/>} />
          <Route path={'/resume'} element={<ResumePage/>} />
          <Route path={'/contact'} element={<ContactPage/>} />
          <Route path={'/login'} element={<LoginPage/>} />
          <Route path={'/register'} element={<RegisterPage/>} />
          <Route path={'/create'} element={<CreatePost />} />
          <Route path='/post/:id' element={<PostPage />}></Route>
          <Route path='/edit/:id' element={<EditPost />} />
          <Route path='/user/:id' element={<UserPage />} />
          <Route path='/user/editbio/:id' element={<EditBio />} />
          <Route path={'/weather'} element={<WeatherPage />} />
          <Route path={'/blackjack'} element={<BlackJack />} />
        </Route>
      </Routes>
    </UserContextProvider>
    
  );
}

export default App;