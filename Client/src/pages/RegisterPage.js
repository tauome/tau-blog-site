import { useState } from "react"

export default function RegisterPage () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const baseUrl = process.env.baseUrl; 

    async function register (e) {
        e.preventDefault(); 
        const response = await fetch(`https://tau-blog-site.vercel.app/api/register`, {
            method: 'POST',
            body: JSON.stringify({username, password}), 
            headers: {'Content-Type': 'application/json'}
        })
        if (response.status === 200) {
            alert('Registration Successful!')
        } else {
            alert('Registration Failed')
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input  type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}/>
            <input  type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}></input>
            <button>Register</button>
        </form>
    )
}