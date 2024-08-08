import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const baseUrl = process.env.baseUrl;  
    // http://localhost:4000

      useEffect(() => {
        const fetchPostInfo = async () => {
          try {
            const response = await fetch(`https://tau-blog-site.vercel.app/api/post`);
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            
            const post = await response.json();
            setPosts(post)
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
          }
        };
         fetchPostInfo();
        

      }, []);  // Include id in the 

    return (
        <>
        {posts.length > 0 && posts.map(post => (
            <Post {...post}/>
        ))}
        </>
    )
}