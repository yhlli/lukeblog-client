import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

//export const address = 'http://localhost:4000'
export const address = 'https://lukeblog-api.onrender.com'

export default function Header(){
  const {setUserInfo,userInfo} = useContext(UserContext);
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [vIp, setVIp] = useState('');
  
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async () => await fetch(address+'/profile', {
      credentials: 'include',
    }).then(response =>{
      if (response.status == 401){
        logout();
      } else if (userInfo?.username == undefined){
        logout();
      }else{
        response.json().then(userInfo=>{
          setUserInfo(userInfo);
        });
      }
    });
    const fetchip = async () => await fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(res => {
        setVIp(res.ip)
        setCity(res.city)
        setRegion(res.region_code)
        setCountry(res.country_code)
    });
    fetchData();
    fetchip();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(address+'/logout', {
        credentials: 'include',
        method: 'POST',
      });
      if (response.ok){
        setUserInfo(null);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <header>
      <Link to="/" className="logo">Luke's Blog</Link>
        <Link to="/weather" className="location">{city}, {region} {country}</Link>
      <nav>
        <ul id="menu">
          <li><Link to="/about">About</Link>
            <ul>
              <li><a href="https://github.com/yhlli" target="_blank">Github</a></li>
              <li><a href="https://www.linkedin.com/in/luke-li-398787142" target="_blank">LinkedIn</a></li>
              <li><Link to="/resume">My Resume</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blackjack">Blackjack</Link></li>
              {userInfo !== null && <li><Link to={`${userInfo.username}/grocery`}>Grocery List</Link></li>}
            </ul>
          </li>
          {(userInfo === null || userInfo === undefined) ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/create">Create Post</Link></li>
              <li><Link to={`/user/${userInfo.username}`}>My Profile</Link></li>
              <li><Link onClick={() => logout()}>Logout</Link></li>
            </>
          )}  
        </ul>
      </nav>
    </header>
  )
}