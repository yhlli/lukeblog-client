import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

//http://localhost:4000
//https://lukeblog-api.onrender.com
export const address = 'https://lukeblog-api.onrender.com'

export default function Header(){
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(()=>{
    fetch(address+'/profile', {
      credentials: 'include',
    }).then(response =>{
      if (response.status == 401){
        logout();
      } else{
        response.json().then(userInfo=>{
          setUserInfo(userInfo);
        });
      }
    });
  }, [userInfo]);

  async function logout(){
    fetch(address+'/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
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
          {userInfo !== null && (
            <>
              <li><Link to="/create">Create Post</Link></li>
              <li><Link to={`/user/${userInfo.username}`}>My Profile</Link></li>
              <li><Link onClick={logout}>Logout</Link></li>
            </>
          )}
          {userInfo === null && (
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