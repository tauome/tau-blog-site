import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const baseUrl = process.env.baseUrl;  

    useEffect(() => {
        fetch(`${baseUrl}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts); 
            })
        })
    }, [])

    return (
        <>
        {posts.length > 0 && posts.map(post => (
            <Post {...post}/>
        ))}
        </>
    )
}