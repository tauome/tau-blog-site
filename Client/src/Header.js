import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
const {setUserInfo, userInfo} = useContext(UserContext);
const baseUrl = process.env.baseUrl; 

useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://tau-blog-site.vercel.app/api/profile', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(res => {
        res.json().then(userInfo => {
        setUserInfo(userInfo);
        })});
        }
    }, [setUserInfo]);

//invalidate the cookie
async function logout() {
    const token = localStorage.getItem('token');
    await fetch(`https://tau-blog-site.vercel.app/api/logout`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
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
