import { Link } from "react-router-dom";

export default function Header(){
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
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>
    )
}