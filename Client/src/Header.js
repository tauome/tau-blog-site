import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
const {setUserInfo, userInfo} = useContext(UserContext);

const baseUrl = process.env.baseUrl; 

useEffect(() => {
    fetch(`https://tau-blog-site.vercel.app/api/profile`, {
        credentials: 'include'
    }).then(res => {
        res.json().then(userInfo => {
            setUserInfo(userInfo);
        })
    })
}, [])

//invalidate the cookie
async function logout() {
    await fetch(`https://tau-blog-site.vercel.app/api/logout`, {
        credentials: 'include',
        method: 'POST'
    });
    setUserInfo(null); 
}

const username =  userInfo?.username; 

  return (
    <header>
        <Link className="logo" to="/">My Blog</Link>
        <nav>
            {username && (
                <>
                    <span>Hello, @{username}</span>
                    <Link to={'/create'}>Create New Post</Link>
                    <Link to="/" onClick={logout}>Logout</Link>
                </>
            )}
            {!username && (
                <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                </>
            )}
        </nav>     
    </header>
  )
}
