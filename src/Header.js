import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//http://localhost:4000
//https://lukeblog-api.onrender.com
const address = 'https://lukeblog-api.onrender.com'

export default function Header(){
  const [username,setUsername] = useState(null);
  useEffect(()=>{
    fetch(address+'/profile', {
      credentials: 'include',
    }).then(response =>{
      response.json().then(userInfo=>{
        setUsername(userInfo.username);
      });
    });
  }, []);

  function logout(){
    fetch(address+'/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUsername(null);
  }

  return(
    <header>
      <Link to="/" className="logo">Luke's Blog</Link>
      <nav>
        <ul id="menu">
          <li><Link to="/about">About</Link>
            <ul>
              <li><a href="https://github.com/yhlli" target="_blank">Github</a></li>
              <li><a href="https://www.linkedin.com/in/luke-li-398787142" target="_blank">LinkedIn</a></li>
              <li><Link to="/resume">My Resume</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </li>
          {username && (
            <>
              <li><Link to="/create">Create Post</Link></li>
              <li><Link onClick={logout}>Logout</Link></li>
            </>
          )}
          {!username && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}   
        </ul>
      </nav>
    </header>
  )
}